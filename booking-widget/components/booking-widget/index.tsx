"use client"

import React from 'react';
import { createRoot } from 'react-dom/client';
import BookingWidgetContent from './booking-widget-content';
import { BookingWidgetProvider } from './context';
import '@/styles/globals.css';

class BookingWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const companyGuid = this.getAttribute('company-guid');
    if (!companyGuid) {
      console.error('BookingWidget: company-guid attribute is required');
      return;
    }

    // Create a container for React
    const container = document.createElement('div');
    container.className = 'tw-font-sans tw-bg-white tw-text-foreground';
    this.shadowRoot?.appendChild(container);

    // Create and inject styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        all: initial;
        display: block;
        contain: content;
        background-color: white;
        color: black;
      }

      * {
        box-sizing: border-box;
      }

      .tw-font-sans {
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: black;
        background-color: white;
      }

      .tw-text-2xl {
        font-size: 1.5rem;
        line-height: 2rem;
        color: black;
      }

      .tw-font-bold {
        font-weight: 700;
      }

      .tw-mb-6 {
        margin-bottom: 1.5rem;
      }

      .tw-text-center {
        text-align: center;
      }

      .tw-p-6 {
        padding: 1.5rem;
      }

      .tw-space-y-4 > * + * {
        margin-top: 1rem;
      }

      .tw-text-lg {
        font-size: 1.125rem;
        line-height: 1.75rem;
        color: black;
      }

      .tw-font-medium {
        font-weight: 500;
      }

      .tw-grid {
        display: grid;
      }

      .tw-gap-4 {
        gap: 1rem;
      }

      .tw-cursor-pointer {
        cursor: pointer;
      }

      .tw-hover\\:bg-gray-50:hover {
        background-color: #f9fafb;
      }

      .tw-transition-colors {
        transition-property: color, background-color, border-color;
        transition-duration: 150ms;
      }

      .tw-pb-2 {
        padding-bottom: 0.5rem;
      }

      .tw-flex {
        display: flex;
      }

      .tw-items-center {
        align-items: center;
      }

      .tw-mr-2 {
        margin-right: 0.5rem;
      }

      .tw-h-5 {
        height: 1.25rem;
      }

      .tw-w-5 {
        width: 1.25rem;
      }

      .tw-text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: black;
      }

      .tw-text-muted-foreground {
        color: #6b7280;
      }

      .tw-border {
        border-width: 1px;
        border-style: solid;
        border-color: #e5e7eb;
      }

      .tw-rounded-md {
        border-radius: 0.375rem;
      }

      .tw-bg-white {
        background-color: white;
      }

      .tw-shadow-sm {
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      }

      .tw-p-4 {
        padding: 1rem;
      }

      .tw-hover\\:shadow-md:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      button {
        background-color: white;
        border: 1px solid #e5e7eb;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        color: black;
      }

      button:hover {
        background-color: #f9fafb;
      }

      .service-item {
        border: 1px solid #e5e7eb;
        padding: 1rem;
        margin-bottom: 0.5rem;
        border-radius: 0.375rem;
        cursor: pointer;
        background-color: white;
        color: black;
      }

      .service-item:hover {
        background-color: #f9fafb;
        border-color: #d1d5db;
      }
    `;
    this.shadowRoot?.appendChild(style);

    // Mount React app
    const root = createRoot(container);
    root.render(
      <BookingWidgetProvider companyGuid={companyGuid}>
        <BookingWidgetContent />
      </BookingWidgetProvider>
    );
  }
}

// Register web component
customElements.define('booking-widget', BookingWidget);
