const axios = require('axios');
const cheerio = require('cheerio');

class AuditService {
  async analyze(url) {
    const startTime = Date.now();

    try {
      const response = await this.fetchWebsite(url);
      const responseTime = Date.now() - startTime;
      
      const html = response.data;
      const $ = cheerio.load(html);
      
      return this.extractMetrics($, response, responseTime);
    } catch (error) {
      this.handleError(error);
    }
  }

  async fetchWebsite(url) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PagePulseBot/1.0; +https://pagepulse.com)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        validateStatus: (status) => status >= 200 && status < 300
      });

      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html')) {
        const error = new Error('Non-HTML content detected');
        error.message = 'NON_HTML';
        throw error;
      }

      return response;
    } catch (error) {
      const errCode = error.code || '';
      const errMsg = error.message || '';
      const errCause = (error.cause && error.cause.code) || '';

      if (errCode === 'ECONNABORTED' || errCode === 'ETIMEDOUT' || errMsg.includes('timeout') || errMsg === 'TIMEOUT') {
        const timeoutError = new Error('Request timed out');
        timeoutError.message = 'TIMEOUT';
        throw timeoutError;
      }
      
      if (
        errCode === 'ENOTFOUND' ||
        errCode === 'EAI_AGAIN' ||
        errCause === 'ENOTFOUND' ||
        errCause === 'EAI_AGAIN' ||
        errMsg.includes('ENOTFOUND') ||
        errMsg.includes('EAI_AGAIN') ||
        errMsg === 'DNS_FAILURE'
      ) {
        const dnsError = new Error('DNS lookup failed');
        dnsError.message = 'DNS_FAILURE';
        throw dnsError;
      }

      if (
        errCode === 'ECONNREFUSED' ||
        errCode === 'ENETUNREACH' ||
        errCause === 'ECONNREFUSED' ||
        errCause === 'ENETUNREACH' ||
        errMsg.includes('ECONNREFUSED') ||
        errMsg.includes('ENETUNREACH') ||
        errMsg === 'UNREACHABLE'
      ) {
        const unreachableError = new Error('Website unreachable');
        unreachableError.message = 'UNREACHABLE';
        throw unreachableError;
      }

      throw error;
    }
  }

  extractMetrics($, response, responseTime) {
    const title = $('title').text().trim() || 'Not Found';
    
    const metaDescription = $('meta[name="description"]').attr('content') || 'Not Found';
    
    const h1Count = $('h1').length;
    
    const imagesWithoutAlt = $('img').filter((i, el) => {
      const alt = $(el).attr('alt');
      return !alt || alt.trim() === '';
    }).length;
    
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = textContent ? textContent.split(' ').length : 0;
    
    return {
      status: response.status,
      responseTime: `${responseTime} ms`,
      title,
      metaDescription,
      h1Count,
      imagesWithoutAlt,
      wordCount
    };
  }

  handleError(error) {
    if (error.message === 'TIMEOUT' || 
        error.message === 'DNS_FAILURE' || 
        error.message === 'NON_HTML' || 
        error.message === 'UNREACHABLE') {
      throw error;
    }
    throw error;
  }
}

module.exports = new AuditService();