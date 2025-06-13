# web_loader.py
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from langchain.text_splitter import RecursiveCharacterTextSplitter
import re
import logging

class WebLoader:
    def __init__(self, base_url, max_depth=2, max_pages=20):
        self.base_url = base_url
        self.max_depth = max_depth
        self.max_pages = max_pages
        self.visited = set()
        self.content = []
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )

    def load(self):
        self._crawl(self.base_url, depth=0)
        return self.content

    def _crawl(self, url, depth):
        if depth > self.max_depth or len(self.content) >= self.max_pages or url in self.visited:
            return
        
        try:
            response = requests.get(url, timeout=10)
            if response.status_code != 200:
                return
                
            self.visited.add(url)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract main content
            text = self._extract_content(soup)
            if text:
                chunks = self.splitter.split_text(text)
                self.content.extend(chunks)
            
            # Find and follow links
            if depth < self.max_depth:
                for link in soup.find_all('a', href=True):
                    href = link['href']
                    absolute_url = urljoin(url, href)
                    parsed = urlparse(absolute_url)
                    
                    # Stay on same domain
                    if parsed.netloc == urlparse(self.base_url).netloc:
                        self._crawl(absolute_url, depth+1)
                        
        except Exception as e:
            logging.error(f"Error crawling {url}: {str(e)}")

    def _extract_content(self, soup):
        """Extract main content from page"""
        # Remove unwanted elements
        for element in soup(['script', 'style', 'header', 'footer', 'nav']):
            element.decompose()
        
        # Get text from main content areas
        text = ""
        content_selectors = ['main', 'article', '.content', '#content', 'section']
        
        for selector in content_selectors:
            elements = soup.select(selector)
            for element in elements:
                text += element.get_text(separator="\n", strip=True) + "\n"
        
        # Fallback to body if no main content found
        if not text:
            text = soup.body.get_text(separator="\n", strip=True) if soup.body else ""
        
        # Clean up text
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text.strip()