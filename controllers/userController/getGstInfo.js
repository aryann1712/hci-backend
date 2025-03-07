const getGSTInfo = async (req, res, next) => {
    try {
      const gstNumber = req.params.gstNumber;
      console.log('gstNumber', gstNumber);
      
      // Create form data for the first API call
      const formdata = new FormData();
      formdata.append("client_id", process.env.DEEP_VUE_GST_CLIENT_ID);
      formdata.append("client_secret", process.env.DEEP_VUE_GST_CLIENT_SECRET);
      
      const requestOptions = {
        method: 'POST',
        body: formdata,
      };
      
      // First API call with proper async/await handling
      const authResponse = await fetch(process.env.DEEP_VUE_GST_AUTHORIZE_API, requestOptions);
      const authResult = await authResponse.json();
      
      console.log("Authorization result:", authResult);
      
      // Check if the first API call was successful
      if (authResult && authResult.access_token) {
        // Second API call using the data from the first call
        const gstRequestOptions = {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authResult.access_token}`,
            'x-api-key': process.env.DEEP_VUE_GST_CLIENT_SECRET
          }
        };
        
        // Construct URL with query parameters properly
        const gstVerifyUrl = `${process.env.DEEP_VUE_GST_VERIFY_API}?gstin_number=${gstNumber}`;
        
        // Call the GST verification API with the token from the first call
        const gstResponse = await fetch(gstVerifyUrl, gstRequestOptions);
        const gstData = await gstResponse.json();
        
        
      
        // Check if we have valid data to restructure
        if (gstData  && gstData.data ) {
          const originalData = gstData.data;
          
          // Restructure the data into the desired format
          const formattedData = {
            name: originalData.lgnm || "",
            lstupdt: originalData.lstupdt || "",
            rgdt: originalData.rgdt || "",
            ctb: originalData.ctb || "",
            gstin: originalData.gstin || "",
            nba: originalData.nba || [],
            sts: originalData.sts || "",
            tradeNam: originalData.tradeNam || "",
            address: formatAddress(originalData.pradr?.addr)
          };
          
          // Return the restructured data
          return res.status(200).json({
            success: true,
            data: formattedData
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Invalid GST data format received",
            originalResponse: gstData
          });
        }
      } else {
        // If the first API call failed
        return res.status(400).json({
          success: false,
          message: "Failed to authenticate with GST service",
          error: authResult.error || "Unknown error"
        });
      }
    } catch (error) {
      console.error("Error in getGSTInfo:", error);
      next(error);
    }
  };
  
  // Helper function to format address
  function formatAddress(addr) {
    if (!addr) return "";
    
    const parts = [
      addr.bno, // Plot number
      addr.bnm, // Building name
      addr.st,  // Street
      addr.loc, // Location
      addr.dst, // District
      addr.stcd, // State
      addr.pncd  // PIN code
    ];
    
    // Filter out empty parts and join with commas
    return parts.filter(part => part && part.trim() !== "").join(", ");
  }
  
  module.exports = getGSTInfo;