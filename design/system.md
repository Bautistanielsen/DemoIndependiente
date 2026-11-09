# Club design system
Captured from `app/globals.css`. Existing tokens, not a proposed replacement.

## Colors
Source: `app/globals.css :root`, plus white surfaces from `.btn-sec` and `.enc`.
| Token | Value | Use |
| --- | --- | --- |
| --rojo | #e31e24 | Identity, primary buttons |
| --rojo-osc | #b3121a | Debt/errors |
| --negro | #111111 | Text and outlines |
| --crema | #f6f3ee | Background |
| --borde | #e8e2d9 | Dividers |
| --ok | #1f8a4c | Success |
| --ambar | #d99a00 | Warning |
| --apagado | #57514a | Supporting text |
| white | #fff | Surfaces, inverted text |

## Typography
- Display: `var(--font-display), Rockwell, Roboto Slab, Georgia, serif`; boards use Georgia/serif without external fonts. Source: --f-display.
- Body: `var(--font-text), system-ui, -apple-system, Segoe UI, sans-serif`; boards use system-ui/sans-serif. Source: --f-text.
- Body 16px/1.5; headings line-height 1.08; large heading clamp(30px, 8vw, 44px). Source: body, headings, .login-top h1.
- Button 18px/800, small button 16px. Source: .btn, .btn-sm.

## Geometry and spacing
- Content width 560px, side padding 20px. Source: .wrap, .socio-main.
- Existing spacing: 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48px. Source: component rules in app/globals.css.
- Diagonal cut clamp(14px, 3vw, 26px), angle 12deg. Source: --cut, --diag.
- Radius: fields/calendar 0, controls/chips 4px, carnet 6px. Source: .campo input, .dia, .btn, .chip, .carnet.
- No elevation system; active nav inset 4px red indicator. Source: .botnav a[aria-current].

## Components
- Buttons: minimum height 56px, border 2px, radius 4px, red/white primary or black/white .btn-neg.
- Inputs: white, 2px black border, minimum height 56px.
- Header: red/white, diagonal bottom. Source: .enc.
- Navigation: white, 3px black top border, four equal columns, 70px targets. Source: .botnav.
- Focus: 4px black outline, 2px offset. Respect reduced motion. Source: :focus-visible and prefers-reduced-motion.
