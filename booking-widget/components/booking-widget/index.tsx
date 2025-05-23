"use client"

import React from 'react';
import { createRoot } from 'react-dom/client';
import BookingWidgetContent from './booking-widget-content';
import { BookingWidgetProvider } from './context';

const WIDGET_NAME = 'booking-widget'

// Функция для загрузки CSS
async function loadStyles() {
  try {
    const response = await fetch('http://localhost:3001/booking-widget.css');
    if (!response.ok) throw new Error('Failed to load styles');
    return await response.text();
  } catch (error) {
    console.error('Failed to load styles:', error);
    return '';
  }
}

if (!customElements.get(WIDGET_NAME)) {
  customElements.define(
    WIDGET_NAME,
    class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
      }

      async connectedCallback() {
        // Create container for React
        const container = document.createElement('div');
        container.className = 'booking-widget-container';
        this.shadowRoot?.appendChild(container);

        // Add base styles
        const baseStyles = document.createElement('style');
        baseStyles.textContent = `
          :host {
            all: initial;
            display: block;
            contain: content;
            font-family: system-ui, -apple-system, sans-serif;
          }
          .booking-widget-container {
            font-family: system-ui, -apple-system, sans-serif;
            background: white;
            color: #0f172a;
            line-height: 1.5;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
          }
          @media (prefers-color-scheme: dark) {
            .booking-widget-container {
              background: #0f172a;
              color: #f8fafc;
            }
          }
        `;
        this.shadowRoot?.appendChild(baseStyles);

        // Load and add component styles
        const styles = await loadStyles();
        if (styles) {
          const componentStyles = document.createElement('style');
          componentStyles.textContent = styles;
          this.shadowRoot?.appendChild(componentStyles);
        }

        // Mount React app
        const root = createRoot(container);
        root.render(
          <BookingWidgetProvider companyGuid={this.getAttribute('company-guid') || ''}>
            <BookingWidgetContent />
          </BookingWidgetProvider>
        );
      }

      disconnectedCallback() {
        // Cleanup when component is removed
      }
    }
  )
}

export default BookingWidgetContent
