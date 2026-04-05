-- =============================================================================
-- SEED DATA FOR CV BUILDER - COMPREHENSIVE EXAMPLES
-- =============================================================================

-- =============================================================================
-- 1. USERS
-- =============================================================================

INSERT INTO users (id, email, password_hash, full_name, avatar_url, subscription_type) VALUES
('user-001', 'nguyenvanan@gmail.com', '$2b$10$hashedpassword1', 'Nguyễn Văn An', 'https://api.dicebear.com/7.x/avataaars/svg?seed=An', 'premium'),
('user-002', 'tranthib@gmail.com', '$2b$10$hashedpassword2', 'Trần Thị B', 'https://api.dicebear.com/7.x/avataaars/svg?seed=B', 'free'),
('user-003', 'levanc@gmail.com', '$2b$10$hashedpassword3', 'Lê Văn C', 'https://api.dicebear.com/7.x/avataaars/svg?seed=C', 'pro')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. TEMPLATES
-- =============================================================================

-- Template 1: Modern Blue (Sidebar Left)
INSERT INTO templates (id, name, description, thumbnail_url, category, layout_type, is_premium, design_config, sections_config) VALUES
(
  'tmpl-modern-blue',
  'Modern Blue Professional',
  'Clean two-column layout with gradient sidebar. Perfect for developers and tech professionals.',
  'https://placeholder.com/templates/modern-blue-thumb.jpg',
  'professional',
  'sidebar-left',
  false,
  '{
    "colors": {
      "primary": "#2563eb",
      "secondary": "#1e40af",
      "accent": "#60a5fa",
      "gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      "text": {
        "heading": "#1f2937",
        "body": "#4b5563",
        "muted": "#6b7280"
      },
      "background": {
        "page": "#ffffff",
        "sidebar": "gradient"
      }
    },
    "typography": {
      "fonts": {
        "heading": {"family": "Montserrat", "weights": [600, 700], "googleFont": true},
        "body": {"family": "Inter", "weights": [400, 500], "googleFont": true}
      },
      "sizes": {
        "name": "32px",
        "section_title": "18px",
        "subsection": "14px",
        "body": "11px",
        "small": "10px"
      },
      "lineHeights": {
        "heading": 1.2,
        "body": 1.6
      }
    },
    "spacing": {
      "page": {"margin": "15mm"},
      "section": {"marginBottom": "25px"},
      "sidebar": {"padding": "40px 30px"},
      "main": {"padding": "40px"}
    },
    "layout": {
      "columnRatio": "35:65",
      "maxWidth": "210mm"
    },
    "sidebar": {
      "width": "35%",
      "background": "gradient",
      "textColor": "#ffffff",
      "avatar": {
        "size": "120px",
        "shape": "circle",
        "border": "4px solid rgba(255,255,255,0.3)"
      }
    }
  }',
  '{
    "available_sections": [
      {
        "id": "avatar",
        "type": "avatar",
        "label": "Photo",
        "is_required": false,
        "is_visible_by_default": true,
        "layout": {"style": "centered"}
      },
      {
        "id": "header",
        "type": "header",
        "label": "Personal Info",
        "is_required": true,
        "is_visible_by_default": true,
        "layout": {"style": "centered"},
        "fields": [
          {"key": "full_name", "label": "Full Name", "type": "text", "is_visible": true, "order": 1},
          {"key": "job_title", "label": "Job Title", "type": "text", "is_visible": true, "order": 2}
        ]
      },
      {
        "id": "summary",
        "type": "text",
        "label": "About Me",
        "is_required": false,
        "is_visible_by_default": true,
        "layout": {"style": "paragraph"}
      },
      {
        "id": "contact",
        "type": "contact_list",
        "label": "Contact",
        "is_required": true,
        "is_visible_by_default": true,
        "layout": {"style": "list", "showIcons": true}
      },
      {
        "id": "skills",
        "type": "skills",
        "label": "Skills",
        "icon": "⚡",
        "is_required": false,
        "is_visible_by_default": true,
        "layout": {
          "style": "bars",
          "showProficiency": true,
          "proficiencyStyle": "percentage"
        }
      },
      {
        "id": "experience",
        "type": "timeline",
        "label": "Work Experience",
        "icon": "💼",
        "is_required": false,
        "is_visible_by_default": true,
        "layout": {
          "style": "timeline",
          "showDates": true,
          "dateFormat": "MMM YYYY",
          "datePosition": "right"
        }
      },
      {
        "id": "education",
        "type": "timeline",
        "label": "Education",
        "icon": "🎓",
        "is_required": false,
        "is_visible_by_default": true,
        "layout": {"style": "compact", "showGPA": true}
      },
      {
        "id": "languages",
        "type": "list",
        "label": "Languages",
        "icon": "🌐",
        "is_required": false,
        "is_visible_by_default": true,
        "layout": {"style": "dots"}
      }
    ],
    "default_order": ["header", "summary", "experience", "education", "skills", "languages"],
    "sidebar_sections": ["avatar", "header", "contact", "summary"],
    "main_sections": ["skills", "experience", "education", "languages"]
  }'
)
ON CONFLICT (id) DO NOTHING;

-- Template 2: Minimal Black & White
INSERT INTO templates (id, name, description, thumbnail_url, category, layout_type, is_premium, design_config, sections_config) VALUES
(
  'tmpl-minimal-bw',
  'Minimal Black & White',
  'Clean, ATS-friendly single column design. Perfect for traditional industries.',
  'https://placeholder.com/templates/minimal-bw-thumb.jpg',
  'minimal',
  'single-column',
  false,
  '{
    "colors": {
      "primary": "#000000",
      "secondary": "#333333",
      "accent": "#666666",
      "text": {
        "heading": "#000000",
        "body": "#333333",
        "muted": "#666666"
      },
      "background": {
        "page": "#ffffff",
        "section": "#f9f9f9"
      },
      "border": "#e0e0e0"
    },
    "typography": {
      "fonts": {
        "heading": {"family": "Georgia", "weights": [400, 700]},
        "body": {"family": "Arial", "weights": [400, 500]}
      },
      "sizes": {
        "name": "28px",
        "section_title": "16px",
        "subsection": "13px",
        "body": "11px",
        "small": "10px"
      }
    },
    "spacing": {
      "page": {"margin": "20mm"},
      "section": {"marginBottom": "20px"}
    },
    "borders": {
      "width": "1px",
      "style": "solid",
      "radius": "0"
    }
  }',
  '{
    "available_sections": [
      {"id": "header", "type": "header", "is_required": true, "is_visible_by_default": true},
      {"id": "summary", "type": "text", "is_required": false, "is_visible_by_default": true},
      {"id": "experience", "type": "timeline", "is_required": false, "is_visible_by_default": true},
      {"id": "education", "type": "timeline", "is_required": false, "is_visible_by_default": true},
      {"id": "skills", "type": "skills", "is_required": false, "is_visible_by_default": true}
    ],
    "default_order": ["header", "summary", "experience", "education", "skills"]
  }'
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 3. TEMPLATE SAMPLE DATA
-- =============================================================================

INSERT INTO template_sample_data (template_id, sample_data) VALUES
(
  'tmpl-modern-blue',
  '{
    "personal_info": {
      "full_name": "Nguyễn Văn An",
      "job_title": "Senior Full-Stack Developer",
      "email": "nguyenvanan@email.com",
      "phone": "+84 912 345 678",
      "location": "Hà Nội, Việt Nam",
      "photo_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=An",
      "linkedin_url": "linkedin.com/in/nguyenvanan",
      "github_url": "github.com/nguyenvanan",
      "summary": "Experienced full-stack developer with 5+ years of expertise in building scalable web applications using modern technologies."
    },
    "skills": [
      {"category": "Backend", "skill_name": "NestJS", "proficiency_percentage": 90, "proficiency_level": "Expert"},
      {"category": "Backend", "skill_name": "Node.js", "proficiency_percentage": 90, "proficiency_level": "Expert"},
      {"category": "Frontend", "skill_name": "React", "proficiency_percentage": 85, "proficiency_level": "Advanced"}
    ],
    "experiences": [
      {
        "company_name": "VNG Corporation",
        "position": "Senior Backend Developer",
        "location": "TP. Hồ Chí Minh",
        "start_date": "2021-06-01",
        "is_current": true,
        "description": "Lead backend development for high-traffic e-commerce platform",
        "achievements": ["Reduced API response time by 40%", "Implemented microservices architecture"],
        "technologies": ["NestJS", "PostgreSQL", "Redis", "Docker", "AWS"]
      }
    ],
    "education": [
      {
        "institution_name": "Đại học Bách Khoa Hà Nội",
        "degree": "Bachelor of Engineering",
        "field_of_study": "Computer Science",
        "location": "Hà Nội",
        "start_date": "2013-09-01",
        "end_date": "2017-06-30",
        "gpa": "3.6/4.0"
      }
    ],
    "languages": [
      {"language_name": "Vietnamese", "proficiency_level": "Native"},
      {"language_name": "English", "proficiency_level": "Fluent"}
    ]
  }'
)
ON CONFLICT (template_id) DO NOTHING;

-- Verify data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Templates', COUNT(*) FROM templates
UNION ALL
SELECT 'Template Sample Data', COUNT(*) FROM template_sample_data;
