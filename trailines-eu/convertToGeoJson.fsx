#r "nuget: FSharp.Data, 6.3.0"

open FSharp.Data
open System.Text.Json

[<Literal>]
let sample = "./stationsSample.csv"

let url =
    "https://raw.githubusercontent.com/trainline-eu/stations/master/stations.csv"

type Stations = CsvProvider<sample, ";", PreferOptionals=true>
let trainStations = Stations.Load(url)

let parsed =
    trainStations.Rows
    |> Seq.filter (fun r -> r.Country = "DE")
    |> Seq.filter (fun r -> r.Longitude.IsSome && r.Latitude.IsSome)
    |> Seq.filter (fun r -> r.Db_is_enabled = "t" && r.Is_suggestable = "t")
    |> Seq.map (fun r ->
        {| Id = r.Id
           LocalName = r.Name
           Slug = r.Slug
           Uic = r.Uic
           Longitude = r.Longitude.Value
           Latitude = r.Latitude.Value
           DbId = r.Db_id
           InfoEn = r.``Info:en``
           InfoDe = r.``Info:de``
           ParentStationId = r.Parent_station_id |})

type Geometry =
    { Type: string
      Coordinates: (decimal) list }

type Properties =
    { Id: int
      LocalName: string
      Slug: string
      Uic: string
      DbId: string
      InfoEn: string
      InfoDe: string
      ParentStationId: int option }

type Feature =
    { Type: string
      Geometry: Geometry
      Properties: Properties }

type FeatureCollection =
    { Type: string; Features: Feature list }

let FeatureCollection: FeatureCollection =
    let features =
        parsed
        |> Seq.map (fun r ->
            let geometry =
                { Geometry.Type = "Point"
                  Coordinates = [ r.Longitude; r.Latitude ] }

            let properties =
                { Properties.Id = r.Id
                  LocalName = r.LocalName
                  Slug = r.Slug
                  Uic = r.Uic |> Option.defaultValue ""
                  DbId = r.DbId |> Option.defaultValue ""
                  InfoEn = r.InfoEn |> Option.defaultValue ""
                  InfoDe = r.InfoDe |> Option.defaultValue ""
                  ParentStationId = r.ParentStationId |> Option.map (int) }

            { Type = "Feature"
              Geometry = geometry
              Properties = properties })

    { FeatureCollection.Type = "FeatureCollection"
      Features = features |> Seq.toList }

let json =
    JsonSerializer.Serialize(
        FeatureCollection,
        JsonSerializerOptions(WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase)
    )

System.IO.File.WriteAllText("./stations.geojson", json)
