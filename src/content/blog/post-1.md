---
title: "Building Accessible Design Systems"
slug: "building-accessible-design-systems"
date: "2026-05-15"
excerpt: "Lessons learned from building and maintaining design systems that prioritise accessibility without sacrificing developer experience."
tags: ["Design Systems", "Accessibility", "CSS", "React"]
---

Design systems are more than just style guides and component libraries. They're the foundation of how a team builds, and accessibility should be baked in from the start — not bolted on later.

## Why accessibility first?

When you design with accessibility from day one, you avoid costly refactors. Every component becomes usable by more people, and the overall quality of your product improves.

## Key principles

1. **Semantic HTML first** — before adding ARIA, use the right HTML elements
2. **Color contrast** — maintain at least 4.5:1 ratio for normal text
3. **Keyboard navigation** — every interactive element must be reachable and operable
4. **Reduced motion** — respect `prefers-reduced-motion` media query

## Tools we use

We integrated axe-core into our CI pipeline and use Storybook's accessibility addon during development. This catches issues early, when they're cheapest to fix.

Building an accessible design system isn't just the right thing to do — it produces better software for everyone.
