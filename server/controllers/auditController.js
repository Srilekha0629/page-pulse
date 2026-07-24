const auditService = require('../services/auditService');
const urlValidator = require('../services/urlValidator');

exports.analyzeWebsite = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    const validationResult = urlValidator.validate(url);
    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        message: validationResult.message
      });
    }

    const report = await auditService.analyze(url);
    
    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Analysis error:', error.message);
    
    if (error.message === 'TIMEOUT') {
      return res.status(504).json({
        success: false,
        message: 'Request timed out. The website is taking too long to respond.'
      });
    }
    
    if (error.message === 'DNS_FAILURE') {
      return res.status(400).json({
        success: false,
        message: 'DNS failure. The domain could not be resolved.'
      });
    }
    
    if (error.message === 'NON_HTML') {
      return res.status(400).json({
        success: false,
        message: 'The URL does not point to an HTML page.'
      });
    }
    
    if (error.message === 'UNREACHABLE') {
      return res.status(503).json({
        success: false,
        message: 'Website is currently unreachable. Please try again later.'
      });
    }

    if (error.response) {
      // Check for HTTP 403 Forbidden specifically
      if (error.response.status === 403) {
        return res.status(403).json({
          success: false,
          message: 'This website blocks automated requests (HTTP 403 Forbidden).'
        });
      }
      
      return res.status(error.response.status || 500).json({
        success: false,
        message: `Server responded with status ${error.response.status}`
      });
    }

    if (error.request) {
      return res.status(503).json({
        success: false,
        message: 'No response received from the server.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    });
  }
};