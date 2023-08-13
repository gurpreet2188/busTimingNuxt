# Location Based Bus Timing Web App

A fast and efficient Bus Timing Web app build with Nuxt (Vue) using data from Land Transport Authority API in Singapore. The device location is processed server side with an JSON file of over 5000 Bus Stops entries, avoiding the overhead of downloading the JSON data on client side and searching for near by bus stops. Haversine Distance forumala from [GeoDataSource](https://www.geodatasource.com/developers/javascript) is used to calculate and find nearby bus stops.

## Live Preivew (Limited to Singapore)

[Hosted on Vercel](https://bus-timing-nuxt.vercel.app/) 

## Screenshot

<img loading="lazy" width="60%" src="./sitePreview.png" />
