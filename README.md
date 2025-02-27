### Requirements:
- Detect the user's timezone automatically.
- Fetch Maghrib prayer time using the Aladhan API.
- Calculate and display the remaining time until Maghrib.
- Show different text messages based on the remaining hours:
  - **24+ hours left** → "Ramadan Mubarak! Prepare for the next fasting day."
  - **12+ hours left** → "Stay strong! You’re halfway through your fast."
  - **6+ hours left** → "The wait is almost over! Keep going."
  - **3+ hours left** → "Iftar is getting closer! Get ready."
  - **1+ hours left** → "Just a little more patience! Almost time to break your fast."
  - **Less than 1 hour left** → "Iftar is around the corner! Set the table."
  - **0 hours left** → "Maghrib time! Bismillah, enjoy your Iftar!"
- Use TailwindCSS for styling (minimal and clean).
- The page should update in real-time every minute.

### APIs:
1. Get user's timezone: `https://worldtimeapi.org/api/ip`
2. Get prayer times: `https://api.aladhan.com/v1/timingsByCity?city={city}&country={country}&method=2`
