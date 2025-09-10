// Script to create a sample property with Matterport virtual tour
const PropertyService = require('./lib/api/property');

// Sample property data with the provided Matterport virtual tour
const sampleProperty = {
  title: "Austin Travis County EMS Station 33 - Commercial Property",
  description: "A unique commercial property featuring the Austin Travis County EMS Station 33. This property offers excellent visibility and accessibility, perfect for emergency services or commercial use. The building features modern amenities and strategic location in Austin.",
  price: 850000,
  address: "Austin Travis County EMS Station 33",
  city: "Austin",
  state: "Texas",
  zipCode: "78701",
  propertyType: "other",
  bedrooms: 0,
  bathrooms: 4,
  squareFootage: 5500,
  images: ["/images/default-property.jpg"],
  features: ["Emergency Vehicle Bay", "Modern Facilities", "Strategic Location", "Commercial Zoning", "Parking Available"],
  virtualTourUrl: "https://my.matterport.com/show/?m=asUPJZMybAg&brand=0&qs=1",
  status: "active",
  listingDate: new Date().toISOString()
};

console.log('Sample property data:', JSON.stringify(sampleProperty, null, 2));
console.log('\nTo create this property, use the upload form at: http://localhost:3000/dashboard/upload');
console.log('Virtual Tour URL:', sampleProperty.virtualTourUrl);