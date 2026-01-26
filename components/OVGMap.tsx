'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface OVGSite {
  id: number;
  name: string;
  venue_type: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  status: 'contracted' | 'engaged' | 'prospect';
  notes: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

interface OVGMapProps {
  sites: OVGSite[];
  onSiteSelect?: (site: OVGSite) => void;
}

// Custom marker icons for different statuses
const createMarkerIcon = (status: string) => {
  const colors = {
    contracted: '#22c55e', // green
    engaged: '#eab308', // yellow
    prospect: '#6b7280', // gray
  };
  
  const color = colors[status as keyof typeof colors] || colors.prospect;
  
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="40">
      <path fill="${color}" stroke="#1f2937" stroke-width="1" d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 7.13 8.5 15.5 8.5 15.5s8.5-8.37 8.5-15.5C20.5 3.81 16.69 0 12 0z"/>
      <circle fill="white" cx="12" cy="8.5" r="4"/>
    </svg>
  `;
  
  return L.divIcon({
    className: 'custom-marker',
    html: svgIcon,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

export default function OVGMap({ sites, onSiteSelect }: OVGMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map centered on US
    const map = L.map(mapContainerRef.current, {
      center: [39.8283, -98.5795], // Center of US
      zoom: 4,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add dark-themed tile layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Create layer group for markers
    markersRef.current = L.layerGroup().addTo(map);
    
    mapRef.current = map;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when sites change
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    // Clear existing markers
    markersRef.current.clearLayers();

    // Filter sites with valid coordinates
    const sitesWithCoords = sites.filter(
      (site) => site.latitude !== null && site.longitude !== null
    );

    if (sitesWithCoords.length === 0) return;

    // Add markers for each site
    sitesWithCoords.forEach((site) => {
      const marker = L.marker([site.latitude!, site.longitude!], {
        icon: createMarkerIcon(site.status),
      });

      // Create popup content
      const statusBadge = {
        contracted: '<span style="background:#22c55e20;color:#22c55e;padding:2px 8px;border-radius:999px;font-size:11px;">Contracted</span>',
        engaged: '<span style="background:#eab30820;color:#eab308;padding:2px 8px;border-radius:999px;font-size:11px;">Engaged</span>',
        prospect: '<span style="background:#6b728020;color:#9ca3af;padding:2px 8px;border-radius:999px;font-size:11px;">Prospect</span>',
      };

      const popupContent = `
        <div style="min-width:200px;color:#fff;">
          <h3 style="font-weight:600;font-size:14px;margin:0 0 8px 0;">${site.name}</h3>
          <div style="margin-bottom:8px;">${statusBadge[site.status]}</div>
          ${site.venue_type ? `<p style="font-size:12px;color:#9ca3af;margin:0 0 4px 0;">${site.venue_type}</p>` : ''}
          ${site.city || site.state ? `<p style="font-size:12px;color:#9ca3af;margin:0;">${[site.city, site.state].filter(Boolean).join(', ')}</p>` : ''}
          ${site.notes ? `<p style="font-size:11px;color:#6b7280;margin:8px 0 0 0;border-top:1px solid #374151;padding-top:8px;">${site.notes}</p>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'ovg-popup',
        closeButton: true,
      });

      marker.addTo(markersRef.current!);
    });

    // Fit bounds to show all markers
    if (sitesWithCoords.length > 1) {
      const bounds = L.latLngBounds(
        sitesWithCoords.map((site) => [site.latitude!, site.longitude!])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (sitesWithCoords.length === 1) {
      mapRef.current.setView(
        [sitesWithCoords[0].latitude!, sitesWithCoords[0].longitude!],
        10
      );
    }
  }, [sites]);

  return (
    <>
      <style jsx global>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        .ovg-popup .leaflet-popup-content-wrapper {
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
        }
        .ovg-popup .leaflet-popup-tip {
          background: #1f2937;
          border-left: 1px solid #374151;
          border-bottom: 1px solid #374151;
        }
        .ovg-popup .leaflet-popup-close-button {
          color: #9ca3af;
        }
        .ovg-popup .leaflet-popup-close-button:hover {
          color: #fff;
        }
      `}</style>
      <div 
        ref={mapContainerRef} 
        className="w-full h-[600px]"
        style={{ background: '#1a1a2e' }}
      />
    </>
  );
}
