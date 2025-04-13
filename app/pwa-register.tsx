"use client"

import { useEffect } from "react"

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && window.workbox !== undefined) {
      const wb = window.workbox

      // Add event listeners to handle PWA lifecycle
      wb.addEventListener("installed", (event: Event) => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      wb.addEventListener("controlling", (event: Event) => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      wb.addEventListener("activated", (event: Event) => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })

      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install
      wb.addEventListener("waiting", (event: Event) => {
        console.log(`Event ${event.type} is triggered.`, event)
        // Update the UI to let the user know they can refresh to update
        if (confirm("A new version of TypeMe is available. Click OK to refresh and update.")) {
          // Send a message to the service worker to skip waiting and activate
          wb.messageSkipWaiting()
        }
      })

      // Register the service worker after event listeners have been added
      wb.register()
    }
  }, [])

  return null
}
