# FreeCodeCamp «Zipline: Show the Local Weather»

This is my solution for the [FreeCodeCamp](http://freecodecamp.com) [Zipline: Show the Local Weather](http://freecodecamp.com/challenges/zipline-show-the-local-weather).

I use [OpenWeatherMap](http://openweathermap.org), with their
[Current Weather API](http://openweathermap.org/current), like my
weather data source.
Just like other weather API out there, an API key is required for using it.
Yes, we get responses even without provide it, but
[that's only supported for documentation convenience purpose](https://openweathermap.desk.com/customer/portal/questions/13093709-api-access-ways-and-differences-on-limit).

For geolocation, I rely on the native [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation) and, when it isn't available, I fallback to
[Telize IP Geolocation API](http://www.telize.com/).

For icons, I opted for the excelent font [Weather Icons](https://erikflowers.github.io/weather-icons/).

For webfonts, I stay classic with the
[Google Fonts](https://www.google.com/fonts) service. I'm displaying the fonts:

- [Patua One](http://www.google.com/fonts/specimen/Patua+One);
- [Raleway](https://www.google.com/fonts/specimen/Raleway);
- [Squada One](https://www.google.com/fonts/specimen/Squada+One).

With [Flag Sprites](https://www.flag-sprites.com/), I
got an sprite with all country flags of the world and their related CSS.

Finally, for all the background photos, I resorted to
[Pixabay](https://pixabay.com), where all pictures are shared with a pretty
permisive license ([Creative Commons CCO](https://creativecommons.org/publicdomain/zero/1.0/deed.en)
.
The only exception for that is the photo of the
[cyclone Catarina](https://commons.wikimedia.org/wiki/File:Cyclone_Catarina_from_the_ISS_on_March_26_2004.JPG),
that was created by [NASA](http://eol.jsc.nasa.gov/SearchPhotos/photo.pl?mission=ISS008&roll=E&frame=19646) and, therefore, is also in the public domain.
