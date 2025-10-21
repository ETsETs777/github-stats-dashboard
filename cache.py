from datetime import datetime, timedelta
from threading import Lock


class SimpleCache:
    def __init__(self, ttl_seconds=3600):
        self._cache = {}
        self._lock = Lock()
        self.ttl = ttl_seconds
    
    def get(self, key):
        with self._lock:
            if key in self._cache:
                data, timestamp = self._cache[key]
                if datetime.now() - timestamp < timedelta(seconds=self.ttl):
                    return data
                else:
                    del self._cache[key]
            return None
    
    def set(self, key, value):
        with self._lock:
            self._cache[key] = (value, datetime.now())
    
    def clear(self):
        with self._lock:
            self._cache.clear()
    
    def delete(self, key):
        with self._lock:
            if key in self._cache:
                del self._cache[key]

