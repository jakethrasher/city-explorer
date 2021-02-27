function locationResponse(data) {
  return {
    formatted_query: data[0].display_name,
    latitude: data[0].lat,
    longitude: data[0].lon,
  };
}
function weatherMunge(data){
  let array = data.data.map(item=>{
    return {
      forecast:item.weather.description,
      time:new Date(item.ts * 1000).toDateString()
    };
  });
  return array.slice(0, 7);
}
function mungeReview(reviewData){
  return reviewData.businesses.map(item=>({
    name: item.name,
    image_url: item.image_url,
    price:item.price,
    rating: item.rating,
    url: item.url,
  }));
}

module.exports = {
  locationResponse,
  weatherMunge,
  mungeReview
};