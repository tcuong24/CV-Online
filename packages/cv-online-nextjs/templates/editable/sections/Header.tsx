"use client";

import React from "react";
import { useCvStore } from "@/stores/useCVStore";

interface HeaderProps {
  profile: {
    full_name: string;
    avatar?: string;
    phone?: string;
    address?: string;
    email?: string;
    date_of_birth?: Date;
  };
  title: string | null;
}

export function Header({ profile, title }: HeaderProps) {
  const { updateFullName, updatePhone, updateAddress, updateEmail } = useCvStore();

  const handleBlur = (field: string, e: React.FocusEvent<HTMLDivElement>) => {
    const value = e.currentTarget.textContent || "";
    
    switch (field) {
      case "fullName":
        updateFullName(value);
        break;
      case "phone":
        updatePhone(value);
        break;
      case "email":
        updateEmail(value);
        break;
      case "address":
        updateAddress(value);
        break;
    }
  };

  return (
    <div
      style={{
        marginBottom: "32px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt="avatar"
            width={100}
            height={100}
            style={{ borderRadius: "8px", objectFit: "cover" }}
          />
        )}
        <div style={{ flex: 1 }}>
          {/* Name - Editable */}
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleBlur("fullName", e)}
            data-placeholder="Click to add your name..."
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              margin: "0 0 8px 0",
              color: "var(--cv-color, #2563eb)",
              outline: "none",
              minHeight: "44px",
              padding: "4px",
              borderRadius: "4px",
              cursor: "text",
            }}
            className="editable-field"
          >
            {profile.full_name || ""}
          </div>
          
          {/* Title - Static */}
          <p
            style={{ fontSize: "20px", color: "#6b7280", margin: "0 0 16px 0" }}
          >
            {title}
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            {/* Phone - Editable */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📞</span>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleBlur("phone", e)}
                data-placeholder="Click to add phone..."
                style={{
                  outline: "none",
                  minWidth: "150px",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  cursor: "text",
                }}
                className="editable-field"
              >
                {profile.phone || ""}
              </div>
            </div>
            
            {/* Email - Editable */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>✉️</span>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleBlur("email", e)}
                data-placeholder="Click to add email..."
                style={{
                  outline: "none",
                  minWidth: "150px",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  cursor: "text",
                }}
                className="editable-field"
              >
                {profile.email || ""}
              </div>
            </div>
            
            {/* Address - Editable */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📍</span>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleBlur("address", e)}
                data-placeholder="Click to add address..."
                style={{
                  outline: "none",
                  minWidth: "150px",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  cursor: "text",
                }}
                className="editable-field"
              >
                {profile.address || ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .editable-field:hover {
          background-color: #f3f4f6;
        }
        
        .editable-field:focus {
          background-color: #dbeafe;
          border: 1px solid #3b82f6;
        }
        
        .editable-field:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
