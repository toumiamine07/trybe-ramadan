import React, { useState, useEffect } from 'react';
import { Moon, Clock, Calendar } from 'lucide-react';

interface PrayerTimes {
  Maghrib: string;
}

interface TimeData {
  datetime: string;
  timezone: string;
  city?: string;
  country?: string;
}

function App() {
  const [timeData, setTimeData] = useState<TimeData | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [remainingTime, setRemainingTime] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's timezone and location
  useEffect(() => {
    const fetchTimeData = async () => {
      try {
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();
        
        // For demo purposes, we'll use a default city and country
        // In a real app, you would use a geolocation API to get the user's city and country
        setTimeData({
          ...data,
          city: 'Dubai', // Default city
          country: 'United Arab Emirates', // Default country
        });
      } catch (err) {
        setError('Failed to fetch time data. Please refresh the page.');
        setLoading(false);
      }
    };

    fetchTimeData();
  }, []);

  // Fetch prayer times once we have the user's location
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      if (!timeData?.city || !timeData?.country) return;

      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${timeData.city}&country=${timeData.country}&method=2`
        );
        const data = await response.json();
        setPrayerTimes({
          Maghrib: data.data.timings.Maghrib,
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch prayer times. Please refresh the page.');
        setLoading(false);
      }
    };

    if (timeData) {
      fetchPrayerTimes();
    }
  }, [timeData]);

  // Calculate remaining time until Maghrib
  useEffect(() => {
    if (!prayerTimes) return;

    const calculateRemainingTime = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const maghribTime = new Date(`${today}T${prayerTimes.Maghrib}:00`);

      // If Maghrib has already passed today, show tomorrow's Maghrib
      if (now > maghribTime) {
        maghribTime.setDate(maghribTime.getDate() + 1);
      }

      const diff = maghribTime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRemainingTime({ hours, minutes, seconds });
    };

    calculateRemainingTime();
    const interval = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  // Get message based on remaining time
  const getMessage = () => {
    if (!remainingTime) return '';

    const { hours, minutes } = remainingTime;
    const totalHours = hours + minutes / 60;

    if (totalHours >= 24) {
      return 'Ramadan Mubarak! Prepare for the next fasting day.';
    } else if (totalHours >= 12) {
      return 'Stay strong! You\'re halfway through your fast.';
    } else if (totalHours >= 6) {
      return 'The wait is almost over! Keep going.';
    } else if (totalHours >= 3) {
      return 'Iftar is getting closer! Get ready.';
    } else if (totalHours >= 1) {
      return 'Just a little more patience! Almost time to break your fast.';
    } else if (totalHours > 0) {
      return 'Iftar is around the corner! Set the table.';
    } else {
      return 'Maghrib time! Bismillah, enjoy your Iftar!';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-orange-600 text-xl font-semibold">
          Loading prayer times...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-red-600 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center">
          <div className="flex justify-center mb-2">
            <Moon className="text-white h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Ramadan Mubarak</h1>
          <p className="text-orange-100">May this holy month bring peace and blessings</p>
        </div>

        {/* Timer Section */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <Clock className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Time Until Maghrib</h2>
          </div>

          {remainingTime && (
            <div className="flex justify-center space-x-4 mb-6">
              <div className="bg-orange-100 rounded-lg p-3 w-24 text-center">
                <div className="text-3xl font-bold text-orange-600">{remainingTime.hours}</div>
                <div className="text-sm text-orange-800">Hours</div>
              </div>
              <div className="bg-orange-100 rounded-lg p-3 w-24 text-center">
                <div className="text-3xl font-bold text-orange-600">{remainingTime.minutes}</div>
                <div className="text-sm text-orange-800">Minutes</div>
              </div>
              <div className="bg-orange-100 rounded-lg p-3 w-24 text-center">
                <div className="text-3xl font-bold text-orange-600">{remainingTime.seconds}</div>
                <div className="text-sm text-orange-800">Seconds</div>
              </div>
            </div>
          )}

          {/* Prayer Time Info */}
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="text-orange-500 mr-2 h-5 w-5" />
                <span className="text-gray-700">Maghrib Prayer</span>
              </div>
              <span className="font-semibold text-orange-600">
                {prayerTimes?.Maghrib}
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="bg-orange-500 text-white p-4 rounded-lg text-center mb-6">
            <p className="font-medium">{getMessage()}</p>
          </div>

          {/* Location Info */}
          {timeData && (
            <div className="text-center text-sm text-gray-600">
              <p>
                Location: {timeData.city}, {timeData.country}
              </p>
              <p>Timezone: {timeData.timezone}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-orange-50 p-4 text-center border-t border-orange-100">
          <p className="text-orange-700 font-medium">
            May your fasting be accepted
          </p>
          <p className="text-orange-600 text-sm mt-1">تقبل الله منا ومنكم</p>
        </div>
      </div>
    </div>
  );
}

export default App;