from html.parser import HTMLParser

class TagValidator(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag not in ["img", "input", "br", "hr", "meta", "link", "source"]:
            self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if tag not in ["img", "input", "br", "hr", "meta", "link", "source"]:
            if not self.stack:
                self.errors.append(f"Unexpected end tag </{tag}> at line {self.getpos()[0]}")
            else:
                last_tag, pos = self.stack.pop()
                if last_tag != tag:
                    self.errors.append(f"Mismatched tag: expected </{last_tag}> (from line {pos[0]}), found </{tag}> at line {self.getpos()[0]}")

    def validate(self, html):
        self.feed(html)
        while self.stack:
            tag, pos = self.stack.pop()
            self.errors.append(f"Unclosed tag <{tag}> at line {pos[0]}")
        return self.errors

with open(r'd:\web\templates\home.html', 'r', encoding='utf-8') as f:
    html = f.read()

validator = TagValidator()
errors = validator.validate(html)
if errors:
    for e in errors:
        print(e)
else:
    print("No HTML tag errors found.")
