# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: localization.spec.ts >> en >> switches equivalent routes and preserves query and hash
- Location: tests/e2e/localization.spec.ts:49:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Tearing down "context" exceeded the test timeout of 30000ms.
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - link "Zum Hauptinhalt springen" [ref=e3] [cursor=pointer]:
      - /url: "#main-content"
    - banner [ref=e4]:
      - generic [ref=e5]:
        - link "Pixardia Startseite" [ref=e6] [cursor=pointer]:
          - /url: /de#hero
          - generic [ref=e7]: PIXARDIA
          - generic [ref=e8]: Digitalstudio
        - generic [ref=e9]:
          - navigation "Sprache" [ref=e10]:
            - link "Sprache zu Englisch wechseln" [ref=e11] [cursor=pointer]:
              - /url: /en/contact
              - text: EN
            - link "Sprache zu Deutsch wechseln" [ref=e12] [cursor=pointer]:
              - /url: /de/contact
              - text: DE
          - img [ref=e13]
          - img [ref=e14]
          - link "Projekt starten" [ref=e15] [cursor=pointer]:
            - /url: /de/contact
    - main [active] [ref=e16]:
      - heading "Ein Projekt mit Pixardia starten" [level=1] [ref=e17]
      - region "Gemeinsam Neues schaffen" [ref=e18]:
        - generic [ref=e19]:
          - paragraph [ref=e22]: 06 / PROJEKT STARTEN
          - generic [ref=e23]:
            - heading "Gemeinsam Neues schaffen" [level=2] [ref=e24]
            - img [ref=e25]
          - generic [ref=e27]:
            - generic [ref=e28]:
              - paragraph [ref=e29]: Erzählen Sie uns von Ihrem Unternehmen, Ihrer Herausforderung und dem Produkt, das Sie entwickeln möchten. Gemeinsam schaffen wir eine klare Projektrichtung und begleiten die Umsetzung vom ersten Gespräch bis zu Launch und Support.
              - generic [ref=e30]:
                - paragraph [ref=e31]: In Deutschland zu Hause / Weltweit tätig
                - paragraph [ref=e32]: Direkter Kontakt zum Projektteam
                - paragraph [ref=e33]: Offen für neue Projekte
              - paragraph [ref=e34]: Direkte Kontaktmöglichkeiten
              - link "E-Mail" [ref=e36] [cursor=pointer]:
                - /url: mailto:e2e@pixardia.invalid
              - generic [ref=e37]:
                - img "Pixardia Studio" [ref=e38]
                - generic [ref=e39]:
                  - paragraph [ref=e40]: Pixardia Studio
                  - paragraph [ref=e41]: Von der Idee bis zum Betrieb
              - img [ref=e42]
              - paragraph [ref=e43]: © 2026 Pixardia. Alle Rechte vorbehalten.
            - generic [ref=e44]:
              - img
              - generic [ref=e45]:
                - generic [ref=e46]:
                  - generic [ref=e47]:
                    - generic [ref=e48]: Ihr Name
                    - textbox "Ihr Name" [ref=e49]
                  - generic [ref=e50]:
                    - generic [ref=e51]: E-Mail-Adresse
                    - textbox "E-Mail-Adresse" [ref=e52]:
                      - /placeholder: sie@unternehmen.de
                - generic [ref=e53]:
                  - generic [ref=e54]: Projekttyp
                  - combobox "Projekttyp" [ref=e55]:
                    - option "Unternehmenswebsites" [selected]
                    - option "Landingpages"
                    - option "Webanwendungen"
                    - option "E-Commerce"
                    - option "Website-Redesign"
                    - option "UI- und UX-Design"
                    - option "KI-Automatisierung"
                    - option "Wartung und Support"
                - generic [ref=e56]:
                  - generic [ref=e57]: Projektdetails
                  - textbox "Projektdetails" [ref=e58]:
                    - /placeholder: Beschreiben Sie Ihre Geschäftsziele, benötigten Funktionen und den aktuellen Projektstand …
                - generic [ref=e60] [cursor=pointer]:
                  - checkbox "Ich stimme der Datenschutzerklärung zu Datenschutzerklärung öffnen" [ref=e61]
                  - generic [ref=e62]:
                    - text: Ich stimme der Datenschutzerklärung zu
                    - link "Datenschutzerklärung öffnen" [ref=e63]:
                      - /url: /privacy
                      - text: ↗
                - button "Projektanfrage senden" [ref=e64]
    - contentinfo [ref=e66]:
      - generic [ref=e67]:
        - generic [ref=e68]:
          - generic [ref=e69]:
            - link "Pixardia Startseite" [ref=e70] [cursor=pointer]:
              - /url: /de
              - img "Pixardia Logo" [ref=e71]
            - paragraph [ref=e72]: Wir entwickeln digitale Produkte, die Strategie, eigenständiges Design und zuverlässige Technik verbinden.
            - generic [ref=e73]:
              - link "Nach oben" [ref=e74] [cursor=pointer]:
                - /url: "#top"
                - text: ↑
              - link "Projekt starten" [ref=e75] [cursor=pointer]:
                - /url: /de/contact
          - navigation "Entdecken" [ref=e76]:
            - paragraph [ref=e77]: Entdecken
            - list [ref=e78]:
              - listitem [ref=e79]:
                - link "Leistungen" [ref=e80] [cursor=pointer]:
                  - /url: /de/services
              - listitem [ref=e81]:
                - link "Prozess" [ref=e82] [cursor=pointer]:
                  - /url: /de#crafting-structure
              - listitem [ref=e83]:
                - link "Expertise" [ref=e84] [cursor=pointer]:
                  - /url: /de#neural-system
              - listitem [ref=e85]:
                - link "Projekte" [ref=e86] [cursor=pointer]:
                  - /url: /de#projects
              - listitem [ref=e87]:
                - link "Kontakt" [ref=e88] [cursor=pointer]:
                  - /url: /de/contact
          - navigation "Kompetenzen" [ref=e89]:
            - paragraph [ref=e90]: Kompetenzen
            - list [ref=e91]:
              - listitem [ref=e92]:
                - link "Websites" [ref=e93] [cursor=pointer]:
                  - /url: /de/services/business-website
              - listitem [ref=e94]:
                - link "Webanwendungen" [ref=e95] [cursor=pointer]:
                  - /url: /de/services/web-application
              - listitem [ref=e96]:
                - link "E-Commerce" [ref=e97] [cursor=pointer]:
                  - /url: /de/services/ecommerce
              - listitem [ref=e98]:
                - link "KI & Automatisierung" [ref=e99] [cursor=pointer]:
                  - /url: /de/services/ai-automation
              - listitem [ref=e100]:
                - link "Support" [ref=e101] [cursor=pointer]:
                  - /url: /de/services/maintenance-support
          - generic [ref=e102]:
            - paragraph [ref=e103]: Sie planen ein Projekt?
            - generic [ref=e104]:
              - generic [ref=e105]:
                - generic [ref=e106]: E-Mail
                - link "e2e@pixardia.invalid" [ref=e107] [cursor=pointer]:
                  - /url: mailto:e2e@pixardia.invalid
              - generic [ref=e108]:
                - generic [ref=e109]: Website
                - link "localhost" [ref=e110] [cursor=pointer]:
                  - /url: http://localhost:3100
              - generic [ref=e111]:
                - generic [ref=e112]: Standort
                - strong [ref=e113]: Deutschland / Weltweit
              - generic [ref=e114]:
                - generic [ref=e115]: Status
                - strong [ref=e116]: Offen für ausgewählte Projekte
        - generic [ref=e118]:
          - paragraph [ref=e119]: Klarer Umfang. Planbare Umsetzung. // Bereit für den produktiven Einsatz.
          - generic [ref=e120]:
            - navigation "Rechtliche Informationen" [ref=e121]:
              - link "Datenschutz" [ref=e122] [cursor=pointer]:
                - /url: /privacy
              - link "Impressum" [ref=e123] [cursor=pointer]:
                - /url: /imprint
            - paragraph [ref=e124]: © 2026 Pixardia. Alle Rechte vorbehalten.
        - generic [ref=e125]:
          - img
          - link "Pixardia Startseite" [ref=e126] [cursor=pointer]:
            - /url: /de
            - text: Pixardia
          - img
        - generic [ref=e127]:
          - paragraph [ref=e128]: Digitalstudio für den gesamten Produktzyklus
          - paragraph [ref=e129]: Offen für ausgewählte Projekte
  - alert [ref=e130]
```