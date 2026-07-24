exports.validate = (inputUrl) => {
  try {
    const parsedUrl = new URL(inputUrl);
    
    if (!parsedUrl.protocol || !['http:', 'https:'].includes(parsedUrl.protocol)) {
      return {
        valid: false,
        message: 'Invalid protocol. Only HTTP and HTTPS are supported.'
      };
    }

    if (!parsedUrl.hostname) {
      return {
        valid: false,
        message: 'Invalid URL. Please provide a valid domain.'
      };
    }

    const hostname = parsedUrl.hostname;
    const domainRegex = /^(?=.{1,255}$)(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/;
    
    if (!domainRegex.test(hostname) && hostname !== 'localhost') {
      return {
        valid: false,
        message: 'Invalid domain format. Please check the URL.'
      };
    }

    return {
      valid: true,
      url: parsedUrl.toString()
    };
  } catch (error) {
    return {
      valid: false,
      message: 'Invalid URL format. Please enter a valid URL.'
    };
  }
};