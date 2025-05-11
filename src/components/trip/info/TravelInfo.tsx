
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TripProps } from "@/components/trips/TripCard";
import { Cloud, CloudRain, CloudSun, Phone, AlertTriangle, Info, DollarSign, Languages, Users } from "lucide-react";

type TravelInfoProps = {
  travelInfo: {
    weather: {
      forecast: Array<{
        date: string;
        condition: string;
        high: number;
        low: number;
        precipitation: number;
      }>;
    };
    emergency: {
      police: string;
      ambulance: string;
      tourist_police: string;
      embassy: string;
      hospital: string;
    };
    currency: {
      local: string;
      exchange_rate: number;
      common_prices: Array<{
        item: string;
        price: number;
      }>;
    };
    language: {
      phrases: Array<{
        english: string;
        local: string;
      }>;
    };
    customs: Array<{
      title: string;
      description: string;
    }>;
  };
  trip: TripProps;
};

export function TravelInfo({ travelInfo, trip }: TravelInfoProps) {
  const [amount, setAmount] = useState("1");
  const [currencyDirection, setCurrencyDirection] = useState<"toLocal" | "fromLocal">("toLocal");
  
  // Format a date string to display as Day, Month Date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes('rain')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    } else if (condition.toLowerCase().includes('cloud')) {
      return <CloudSun className="h-8 w-8 text-amber-500" />;
    } else {
      return <Cloud className="h-8 w-8 text-sky-500" />;
    }
  };
  
  // Convert between currencies
  const convertCurrency = () => {
    const value = parseFloat(amount);
    if (isNaN(value)) return "0.00";
    
    if (currencyDirection === "toLocal") {
      // USD to local currency
      return (value * travelInfo.currency.exchange_rate).toFixed(2);
    } else {
      // Local currency to USD
      return (value / travelInfo.currency.exchange_rate).toFixed(2);
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };
  
  const handleSwapDirection = () => {
    setCurrencyDirection(currencyDirection === "toLocal" ? "fromLocal" : "toLocal");
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Travel Information</CardTitle>
          <CardDescription>
            Essential information for your trip to {trip.location}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="weather">
            <TabsList className="w-full max-w-full justify-start px-6 pt-2 gap-2">
              <TabsTrigger value="weather" className="flex-shrink-0">
                <CloudSun className="mr-2 h-4 w-4" />
                Weather
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex-shrink-0">
                <Phone className="mr-2 h-4 w-4" />
                Emergency
              </TabsTrigger>
              <TabsTrigger value="currency" className="flex-shrink-0">
                <DollarSign className="mr-2 h-4 w-4" />
                Currency
              </TabsTrigger>
              <TabsTrigger value="language" className="flex-shrink-0">
                <Languages className="mr-2 h-4 w-4" />
                Language
              </TabsTrigger>
              <TabsTrigger value="customs" className="flex-shrink-0">
                <Users className="mr-2 h-4 w-4" />
                Local Customs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="weather" className="p-6">
              <h3 className="font-medium mb-4">Weather Forecast</h3>
              
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-4 min-w-max">
                  {travelInfo.weather.forecast.map((day, index) => (
                    <div 
                      key={day.date}
                      className="flex flex-col items-center justify-center p-4 border rounded-lg min-w-[120px] animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="text-sm font-medium mb-1">{formatDate(day.date)}</span>
                      <div className="mb-2">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <span className="text-lg font-bold">{day.high}°</span>
                      <span className="text-sm text-muted-foreground">{day.low}°</span>
                      <div className="mt-2 flex items-center">
                        {day.precipitation > 0 ? (
                          <>
                            <CloudRain className="h-3 w-3 mr-1 text-blue-500" />
                            <span className="text-xs">{day.precipitation}%</span>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">No rain</span>
                        )}
                      </div>
                      <Badge 
                        variant={day.condition.toLowerCase().includes('rain') ? "destructive" : "outline"}
                        className="mt-2 text-xs"
                      >
                        {day.condition}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 bg-muted/50 p-4 rounded-md">
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>
                    Weather data is updated daily. Pack accordingly for varying conditions during your trip.
                  </span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="emergency" className="p-6">
              <h3 className="font-medium mb-4">Emergency Contacts</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border p-4 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-red-500" />
                      Emergency Numbers
                    </h4>
                    <Badge variant="outline">Save these numbers</Badge>
                  </div>
                  
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-sm">Police:</span>
                      <span className="font-medium">{travelInfo.emergency.police}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm">Ambulance:</span>
                      <span className="font-medium">{travelInfo.emergency.ambulance}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm">Tourist Police:</span>
                      <span className="font-medium">{travelInfo.emergency.tourist_police}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-sm">Embassy:</span>
                      <span className="font-medium">{travelInfo.emergency.embassy}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border p-4 rounded-md">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                    <h4 className="font-medium">Important Information</h4>
                  </div>
                  
                  <ul className="space-y-2">
                    <li className="text-sm flex items-start gap-2">
                      <span>•</span>
                      <span>Nearest hospital: {travelInfo.emergency.hospital}</span>
                    </li>
                    <li className="text-sm flex items-start gap-2">
                      <span>•</span>
                      <span>Make a copy of your passport and keep it separate from the original.</span>
                    </li>
                    <li className="text-sm flex items-start gap-2">
                      <span>•</span>
                      <span>Register your travel with your country's embassy for emergency assistance.</span>
                    </li>
                    <li className="text-sm flex items-start gap-2">
                      <span>•</span>
                      <span>Save emergency contacts in your phone with ICE (In Case of Emergency) prefix.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="currency" className="p-6">
              <h3 className="font-medium mb-4">
                Currency Information: {currencyDirection === "toLocal" ? "USD to" : travelInfo.currency.local + " to"} {currencyDirection === "toLocal" ? travelInfo.currency.local : "USD"}
              </h3>
              
              <div className="mb-6 border rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Exchange Rate</span>
                  <Badge variant="outline">
                    1 USD = {travelInfo.currency.exchange_rate} {travelInfo.currency.local}
                  </Badge>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium">
                      {currencyDirection === "toLocal" ? "USD" : travelInfo.currency.local}
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={handleAmountChange}
                      className="w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background"
                    />
                  </div>
                  
                  <button 
                    onClick={handleSwapDirection}
                    className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                      <path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                    </svg>
                  </button>
                  
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium">
                      {currencyDirection === "toLocal" ? travelInfo.currency.local : "USD"}
                    </span>
                    <input
                      type="text"
                      value={convertCurrency()}
                      readOnly
                      className="w-full rounded-md border border-input bg-muted px-8 py-2 text-sm ring-offset-background"
                    />
                  </div>
                </div>
              </div>
              
              <h4 className="text-sm font-medium mb-2">Common Prices</h4>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-xs font-medium text-muted-foreground">Item</th>
                      <th className="text-right p-3 text-xs font-medium text-muted-foreground">
                        Price ({travelInfo.currency.local})
                      </th>
                      <th className="text-right p-3 text-xs font-medium text-muted-foreground">
                        Price (USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {travelInfo.currency.common_prices.map((item, index) => (
                      <tr 
                        key={item.item}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="p-3 text-sm">{item.item}</td>
                        <td className="p-3 text-sm text-right font-medium">{item.price.toFixed(2)} {travelInfo.currency.local}</td>
                        <td className="p-3 text-sm text-right text-muted-foreground">
                          ${(item.price / travelInfo.currency.exchange_rate).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 bg-muted/50 p-4 rounded-md">
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>
                    Exchange rates are approximate and may vary. Consider using a no-foreign-transaction-fee credit card for better rates.
                  </span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="language" className="p-6">
              <h3 className="font-medium mb-4">Essential Phrases</h3>
              
              <div className="grid gap-2">
                {travelInfo.language.phrases.map((phrase, index) => (
                  <div 
                    key={phrase.english}
                    className="border rounded-md p-3 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">English</span>
                        <p className="font-medium">{phrase.english}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground">Local</span>
                        <p className="font-bold">{phrase.local}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 bg-muted/50 p-4 rounded-md">
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <Languages className="h-4 w-4" />
                  <span>
                    Consider downloading an offline translation app before your trip for more complex conversations.
                  </span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="customs" className="p-6">
              <h3 className="font-medium mb-4">Local Customs & Etiquette</h3>
              
              <div className="space-y-4">
                {travelInfo.customs.map((custom, index) => (
                  <div 
                    key={custom.title}
                    className="border rounded-md p-4 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <h4 className="font-medium mb-1">{custom.title}</h4>
                    <p className="text-sm text-muted-foreground">{custom.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 bg-muted/50 p-4 rounded-md">
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    Understanding and respecting local customs helps create positive experiences and shows respect for the local culture.
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
