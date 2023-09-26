import re

class Router:
    def __init__(self):
        self.routes = {}
        self.patterns = []

    def set(self, path, method, handler):
        if "{" in path and "}" in path:
            pattern = re.compile(r'^' + re.sub(r'{.*?}', r'(.*?)', path) + '$')
            self.patterns.append((pattern, method, handler))
        else:
            self.routes[f"{path}-{method}"] = handler

    def get(self, path, method):
        try:
            # Check for exact match first
            route = self.routes[f"{path}-{method}"]
            return route, None
        except KeyError:
            pass

        # Check for pattern match
        for pattern, pattern_method, handler in self.patterns:
            if method == pattern_method:
                match = pattern.match(path)
                if match:
                    return handler, match.groups()

        raise RuntimeError(f"Cannot route request to the correct method. path={path}, method={method}")

