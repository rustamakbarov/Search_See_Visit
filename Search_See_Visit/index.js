import express from "express";
import mysql from "mysql";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const port = 3000;
app.use(
  cors({
    origin: "http://localhost:3000", // veya istediğiniz origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,FETCH",
    credentials: true, // gerekirse, istemci tarafından gönderilen çerezlere izin vermek için
  })
);

// MySQL bağlantısı
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Deadpool49",
  database: "mydb",
});

// Statik dosyaları servis et
app.use(express.static("public"));

// Sunucuyu dinle
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});

class Connection {
  constructor() {
    this.#getDataFromDB();
  }

  #getDataFromDB() {
    db.connect((err) => {
      if (err) {
        console.error("MySQL bağlantısı başarısız: " + err.stack);
        return;
      }
      console.log("MySQL bağlantısı başarılı: " + db.threadId);
    });

    // MySQL veritabanından veri çekme endpoint'i
    app.get("/getDataCity", (req, res) => {
      const cityName = req.query.city;

      const query = `SELECT 
      places.PlaceName, 
      places.Information AS PlaceInfo, 
      placesimgs.Image AS PlaceImage, 
      meals.MealName,
      meals.Info AS MealInfo,
      mealsimgs.Photo AS MealPhoto,
      otels.OtelInfo,
      tours.TourInfo,
      restaurants.RestaurantInfo
    FROM 
      places
    LEFT JOIN 
      placesimgs ON places.PlaceID = placesimgs.PlaceID
    LEFT JOIN
      meals ON places.CityID = meals.CityID
    LEFT JOIN 
      mealsimgs ON meals.MealID = mealsimgs.MealID
    LEFT JOIN 
      otels ON places.CityID = otels.CityID
    LEFT JOIN 
      tours ON places.CityID = tours.CityID
    LEFT JOIN 
      restaurants ON places.CityID = restaurants.CityID
    WHERE 
      places.CityID = (SELECT CityID FROM city WHERE CityName = '${cityName}');`;

      db.query(query, (err, results) => {
        if (err) {
          console.error("MySQL sorgusu hastasi: " + err.stack);
          return res.status(500).json({ error: "MySQL sorgusu hastasi", err });
        }
        console.log(res.json(results));
      });
    });
  }
}

const new_connection = new Connection();
