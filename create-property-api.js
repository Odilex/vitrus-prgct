// Script to create property via API call

// Property data with Matterport virtual tour
const propertyData = {
  title: "Austin Travis County EMS Station 33 - Commercial Property",
  description: "A unique commercial property featuring the Austin Travis County EMS Station 33. This property offers excellent visibility and accessibility, perfect for emergency services or commercial use. The building features modern amenities and strategic location in Austin. Experience this property through our immersive 3D virtual tour.",
  propertyType: "commercial",
  price: 850000,
  currency: "USD",
  address: "Austin Travis County EMS Station 33, Austin, TX",
  city: "Austin",
  state: "Texas",
  country: "United States",
  zipCode: "78701",
  bedrooms: 0,
  bathrooms: 4,
  squareFootage: 5500,
  features: [
    "Emergency Vehicle Bay",
    "Modern Facilities", 
    "Strategic Location",
    "Commercial Zoning",
    "Parking Available",
    "3D Virtual Tour",
    "Professional Grade Equipment",
    "Security Systems"
  ],
  images: ["/images/default-property.jpg"],
  virtualTourUrl: "https://my.matterport.com/show/?m=asUPJZMybAg&brand=0&qs=1",
  status: "active",
  is_featured: true,
  listingDate: new Date().toISOString()
};

async function createProperty() {
  try {
    console.log('Creating property with data:', JSON.stringify(propertyData, null, 2));
    
    // Note: This would require authentication token in a real scenario
    // For now, we'll use the upload form instead
    console.log('\n=== PROPERTY CREATION DATA ===');
    console.log('Title:', propertyData.title);
    console.log('Price: $', propertyData.price.toLocaleString());
    console.log('Type:', propertyData.propertyType);
    console.log('Location:', propertyData.city + ', ' + propertyData.state);
    console.log('Virtual Tour URL:', propertyData.virtualTourUrl);
    console.log('\nTo create this property:');
    console.log('1. Go to: http://localhost:3000/dashboard/upload');
    console.log('2. Fill in the form with the above data');
    console.log('3. Paste the virtual tour URL: ' + propertyData.virtualTourUrl);
    console.log('\nThe Matterport embed code you provided will be handled by the virtual tour component.');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createProperty();