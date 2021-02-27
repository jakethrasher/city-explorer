require('dotenv').config();

const { mungeReview } = require('../lib/mungeUtils');

test('returns munged data', async() => {
  // const lat = 27.33643;
  // const lon = -82.5306;
  
  const expectation = [
    {
      'name': 'Owens Fish Camp',
      'image_url': 'https://s3-media3.fl.yelpcdn.com/bphoto/cIEYVhc7dMB-vIh_Tvv9gQ/o.jpg',
      'price': '$$',
      'rating': 4.5,
      'url': 'https://www.yelp.com/biz/owens-fish-camp-sarasota?adjust_creative=iB-g85KitIPLvFXHo4hWFg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iB-g85KitIPLvFXHo4hWFg'
    }
  ];

  const mungie = {
    'businesses': [
      {
        'id': 'USq57A18KfPeheWDfFzVkA',
        'alias': 'owens-fish-camp-sarasota',
        'name': 'Owens Fish Camp',
        'image_url': 'https://s3-media3.fl.yelpcdn.com/bphoto/cIEYVhc7dMB-vIh_Tvv9gQ/o.jpg',
        'is_closed': false,
        'url': 'https://www.yelp.com/biz/owens-fish-camp-sarasota?adjust_creative=iB-g85KitIPLvFXHo4hWFg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=iB-g85KitIPLvFXHo4hWFg',
        'review_count': 1656,
        'categories': [
          {
            'alias': 'seafood',
            'title': 'Seafood'
          }
        ],
        'rating': 4.5,
        'coordinates': {
          'latitude': 27.3319,
          'longitude': -82.53974
        },
        'transactions': [
          'delivery'
        ],
        'price': '$$',
        'location': {
          'address1': '516 Burns Ln',
          'address2': '',
          'address3': '',
          'city': 'Sarasota',
          'zip_code': '34236',
          'country': 'US',
          'state': 'FL',
          'display_address': [
            '516 Burns Ln',
            'Sarasota, FL 34236'
          ]
        },
        'phone': '+19419516936',
        'display_phone': '(941) 951-6936',
        'distance': 1029.578186539982
      }
    ]
  };

  const actual = mungeReview(mungie);
  expect(actual).toEqual(expectation);
});

