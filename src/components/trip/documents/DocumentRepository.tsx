import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { File, Folder, Upload, Search, MoreVertical, Download, FileText, Image, FileSpreadsheet, CalendarIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type DocumentFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploaderName: string;
  timestamp: string;
  url: string;
};

type DocumentFolder = {
  id: string;
  name: string;
  files: string[];
};

type DocumentData = {
  files: DocumentFile[];
  folders: DocumentFolder[];
};

type DocumentRepositoryProps = {
  documentData: DocumentData;
  currentUser: string;
};

export function DocumentRepository({ documentData, currentUser }: DocumentRepositoryProps) {
  const [folders, setFolders] = useState(documentData.folders);
  const [files, setFiles] = useState(documentData.files);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadDestination, setUploadDestination] = useState<string>("root");
  const { toast } = useToast();

  // Get files based on active folder or search term
  const getDisplayedFiles = () => {
    let displayFiles = files;
    
    // Filter by search if there's a search term
    if (searchTerm.trim()) {
      return files.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by active folder if one is selected
    if (activeFolder !== null) {
      const folder = folders.find(f => f.id === activeFolder);
      if (folder) {
        return files.filter(file => folder.files.includes(file.id));
      }
    } else {
      // When no folder is selected, show only files not in any folder
      const filesInFolders = folders.flatMap(f => f.files);
      return files.filter(file => !filesInFolders.includes(file.id));
    }
    
    return displayFiles;
  };
  
  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Folder name required",
        description: "Please enter a name for your new folder.",
        variant: "destructive"
      });
      return;
    }
    
    const newFolder: DocumentFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      files: []
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setIsAddFolderOpen(false);
    
    toast({
      title: "Folder created",
      description: `"${newFolderName}" folder has been created.`
    });
  };
  
  const handleUploadFile = () => {
    // In a real app, this would handle the actual file upload
    const newFile: DocumentFile = {
      id: `file-${Date.now()}`,
      name: "New Uploaded File.pdf",
      type: "pdf",
      size: 1240000,
      uploadedBy: currentUser,
      uploaderName: "Jane Smith", // This would come from user data in a real app
      timestamp: new Date().toISOString(),
      url: "#"
    };
    
    setFiles([...files, newFile]);
    
    // If uploading to a folder, add the file to that folder
    if (uploadDestination !== "root") {
      setFolders(folders.map(folder => {
        if (folder.id === uploadDestination) {
          return {
            ...folder,
            files: [...folder.files, newFile.id]
          };
        }
        return folder;
      }));
    }
    
    setIsUploadFileOpen(false);
    
    toast({
      title: "File uploaded",
      description: `"${newFile.name}" has been uploaded successfully.`
    });
  };
  
  const handleDeleteFile = (fileId: string) => {
    // Remove file
    setFiles(files.filter(file => file.id !== fileId));
    
    // Remove file from any folder it might be in
    setFolders(folders.map(folder => ({
      ...folder,
      files: folder.files.filter(id => id !== fileId)
    })));
    
    toast({
      title: "File deleted",
      description: "The file has been deleted."
    });
  };
  
  const handleDeleteFolder = (folderId: string) => {
    // Get list of files in this folder to potentially delete
    const folderToDelete = folders.find(f => f.id === folderId);
    
    if (!folderToDelete) return;
    
    // Remove folder
    setFolders(folders.filter(folder => folder.id !== folderId));
    
    // If this was the active folder, reset to no active folder
    if (activeFolder === folderId) {
      setActiveFolder(null);
    }
    
    toast({
      title: "Folder deleted",
      description: `"${folderToDelete.name}" folder has been deleted.`
    });
  };
  
  const handleDownloadFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    toast({
      title: "Downloading file",
      description: `"${file.name}" is being downloaded.`
    });
    
    // In a real app, this would trigger the actual download
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'jpg':
      case 'png':
        return <Image className="h-5 w-5 text-blue-500" />;
      case 'xlsx':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };
  
  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const displayedFiles = getDisplayedFiles();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Documents & Files</CardTitle>
            <CardDescription>
              Store and organize all your trip-related files
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddFolderOpen} onOpenChange={setIsAddFolderOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Folder className="mr-2 h-4 w-4" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                  <DialogDescription>
                    Create a new folder to organize your trip files.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="folder-name" className="text-sm font-medium">
                      Folder Name
                    </label>
                    <Input
                      id="folder-name"
                      placeholder="e.g. Reservations, Tickets"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddFolderOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddFolder}>
                    Create Folder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isUploadFileOpen} onOpenChange={setIsUploadFileOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                  <DialogDescription>
                    Upload a document, image or other file for your trip.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="border border-dashed border-input rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, XLSX, JPG, PNG (max. 10MB)
                    </p>
                    <Input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="destination-folder" className="text-sm font-medium">
                      Upload to Folder
                    </label>
                    <select 
                      id="destination-folder"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={uploadDestination}
                      onChange={(e) => setUploadDestination(e.target.value)}
                    >
                      <option value="root">Root (No Folder)</option>
                      {folders.map(folder => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadFileOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUploadFile}>
                    Upload
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Folders Navigation */}
        {!searchTerm && (
          <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
            <Button
              variant={activeFolder === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFolder(null)}
              className="whitespace-nowrap"
            >
              All Files
            </Button>
            {folders.map(folder => (
              <Button
                key={folder.id}
                variant={activeFolder === folder.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFolder(folder.id)}
                className="whitespace-nowrap"
              >
                <Folder className="mr-2 h-4 w-4" />
                {folder.name}
                <Badge variant="outline" className="ml-2">
                  {folder.files.length}
                </Badge>
              </Button>
            ))}
          </div>
        )}
        
        {/* Files List */}
        <div className="space-y-2">
          {/* Current location header */}
          {!searchTerm && (
            <div className="flex justify-between items-center py-2">
              <h3 className="text-sm font-medium">
                {activeFolder === null ? 'All Files' : 
                  folders.find(f => f.id === activeFolder)?.name}
                {searchTerm && ' - Search Results'}
              </h3>
              {activeFolder !== null && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteFolder(activeFolder)}
                >
                  Delete Folder
                </Button>
              )}
            </div>
          )}
          
          {/* Files */}
          {displayedFiles.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Name</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3 hidden md:table-cell">Uploaded By</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3 hidden md:table-cell">Date</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3 hidden sm:table-cell">Size</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {displayedFiles.map((file, index) => (
                    <tr 
                      key={file.id} 
                      className="hover:bg-muted/50 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <span className="text-sm font-medium">{file.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">
                        {file.uploaderName}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">
                        {formatDate(file.timestamp)}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground hidden sm:table-cell">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="p-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownloadFile(file.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteFile(file.id)}>
                              <File className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted h-12 w-12 rounded-full flex items-center justify-center mb-4">
                <File className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No files found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                {searchTerm ? "Try changing your search terms" : "Upload your first file to get started"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsUploadFileOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
