// What the page's style sheets give an element when its reader asks for less motion, as a story cannot switch the
// preference: each declaration of a rule that matches it, under media that hold with "reduce", the last one winning.
// The value asked for, as the feature's own name holds "reduce" too.
const reduce = /:\s*reduce\)/u;

function holds(media: string): boolean {
  if (!media.includes("prefers-reduced-motion")) {
    return matchMedia(media).matches;
  }
  // Tailwind's motion-safe is "not (prefers-reduced-motion: reduce)".
  return reduce.test(media) !== media.trim().startsWith("not");
}

// A selector this engine cannot match, as another engine's pseudo-element, matches nothing.
function matches(element: Element, selector: string): boolean {
  try {
    return element.matches(selector);
  } catch {
    return false;
  }
}

function take(style: CSSStyleDeclaration, found: Map<string, string>): void {
  for (const property of style) {
    found.set(property, style.getPropertyValue(property));
  }
}

function collect(
  rules: CSSRuleList,
  element: Element,
  found: Map<string, string>,
): void {
  for (const rule of rules) {
    if (rule instanceof CSSMediaRule) {
      if (holds(rule.conditionText)) {
        collect(rule.cssRules, element, found);
      }
    } else if (rule instanceof CSSStyleRule) {
      if (matches(element, rule.selectorText)) {
        take(rule.style, found);
        collect(rule.cssRules, element, found);
      }
    } else if (rule instanceof CSSGroupingRule) {
      collect(rule.cssRules, element, found);
    } else if ("style" in rule) {
      // Declarations nested in a rule that matched, after a nested rule of its own.
      take(rule.style as CSSStyleDeclaration, found);
    }
  }
}

function withLessMotion(element: Element): Map<string, string> {
  const found = new Map<string, string>();
  for (const sheet of document.styleSheets) {
    collect(sheet.cssRules, element, found);
  }
  return found;
}

export { withLessMotion };
