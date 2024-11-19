"use client"; 

import { useState, ChangeEvent, FormEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

// Define TypeScript interface for weather data
interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}

export default function WeatherWidget() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (!trimmedLocation) {
      setError("Please enter a valid location.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if (!response.ok) {
        throw new Error("City not found.");
      }
      const data = await response.json();
      setWeather({
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      });
    } catch (err) {
      setError("Error fetching weather data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTemperatureMessage = (temp: number, unit: string): string =>
    unit === "C"
      ? `${temp}°C - ${temp < 10 ? "Cold" : temp < 25 ? "Moderate" : "Hot"}`
      : `${temp}°${unit}`;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader>
          <CardTitle>Weather Widget</CardTitle>
          <CardDescription>
            Search for the current weather in your city.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center gap-4">
            <Input
              type="text"
              placeholder="Enter a city name"
              value={location}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLocation(e.target.value)
              }
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Search"}
            </Button>
          </form>
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {weather && (
            <div className="mt-6 grid gap-4 text-gray-400">
              <div className="flex items-center gap-2">
                <ThermometerIcon className="w-6 h-6 text-blue-400" />
                {getTemperatureMessage(weather.temperature, weather.unit)}
              </div>
              <div className="flex items-center gap-2">
                <CloudIcon className="w-6 h-6 text-gray-400" />
                {weather.description}
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-green-400" />
                {weather.location}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
