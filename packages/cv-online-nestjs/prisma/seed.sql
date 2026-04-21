-- =============================================================================
-- SEED DATA FOR CV BUILDER - COMPREHENSIVE EXAMPLES
-- =============================================================================

-- =============================================================================
-- 1. USERS
-- =============================================================================

INSERT INTO users (id, email, password_hash, full_name, avatar_url, subscription_type, created_at, updated_at) VALUES
('user-001', 'nguyenvanan@gmail.com', '$2b$10$hashedpassword1', 'Nguyễn Văn An', 'https://api.dicebear.com/7.x/avataaars/svg?seed=An', 'premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user-002', 'tranthib@gmail.com', '$2b$10$hashedpassword2', 'Trần Thị B', 'https://api.dicebear.com/7.x/avataaars/svg?seed=B', 'free', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user-003', 'levanc@gmail.com', '$2b$10$hashedpassword3', 'Lê Văn C', 'https://api.dicebear.com/7.x/avataaars/svg?seed=C', 'pro', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. TEMPLATES
-- =============================================================================

-- Template 1: Modern Blue (Sidebar Left)
INSERT INTO templates (id, name, description, thumbnail_url, category, layout_type, is_premium, design_config, sections_config, tags, created_at, updated_at) VALUES
(
  'tmpl-modern-blue',
  'CV Chuyên nghiệp Hiện đại',
  'Bố cục hai cột sạch sẽ với thanh bên dải màu. Hoàn hảo cho các nhà phát triển và chuyên gia công nghệ.',
  '/templates/modern-blue.png',
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
    "default_order": ["header", "experience", "education", "skills", "languages"],
    "sidebar_sections": ["avatar", "header", "contact"],
    "main_sections": ["skills", "experience", "education", "languages"]
  }',
  ARRAY['Chuyên nghiệp', 'Hiện đại', 'Lập trình viên', 'Công nghệ'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category = EXCLUDED.category,
  layout_type = EXCLUDED.layout_type,
  is_premium = EXCLUDED.is_premium,
  design_config = EXCLUDED.design_config,
  sections_config = EXCLUDED.sections_config,
  tags = EXCLUDED.tags,
  updated_at = CURRENT_TIMESTAMP;

-- Template 2: Minimal Black & White
INSERT INTO templates (id, name, description, thumbnail_url, category, layout_type, is_premium, design_config, sections_config, tags, created_at, updated_at) VALUES
(
  'tmpl-minimal-bw',
  'CV Tối giản Đen trắng',
  'Thiết kế một cột sạch sẽ, thân thiện với ATS. Tốt nhất cho các ngành nghề truyền thống.',
  '/templates/minimal-bw.png',
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
      {"id": "experience", "type": "timeline", "is_required": false, "is_visible_by_default": true},
      {"id": "education", "type": "timeline", "is_required": false, "is_visible_by_default": true},
      {"id": "skills", "type": "skills", "is_required": false, "is_visible_by_default": true}
    ],
    "default_order": ["header", "experience", "education", "skills"]
  }',
  ARRAY['Tối giản', 'ATS', 'Truyền thống', 'Một cột'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category = EXCLUDED.category,
  layout_type = EXCLUDED.layout_type,
  is_premium = EXCLUDED.is_premium,
  design_config = EXCLUDED.design_config,
  sections_config = EXCLUDED.sections_config,
  tags = EXCLUDED.tags,
  updated_at = CURRENT_TIMESTAMP;

-- =============================================================================
-- 3. TEMPLATE SAMPLE DATA
-- =============================================================================

INSERT INTO template_sample_data (id, template_id, sample_data, created_at, updated_at) VALUES
(
  'sample-data-001',
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
  }',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  sample_data = EXCLUDED.sample_data,
  updated_at = CURRENT_TIMESTAMP;

-- Verify data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Templates', COUNT(*) FROM templates
UNION ALL
SELECT 'Template Sample Data', COUNT(*) FROM template_sample_data;

INSERT INTO templates (id, name, description, thumbnail_url, preview_pdf_url, category, is_premium, is_published, layout_type, popularity_score, usage_count, version, design_config, sections_config, tags, created_at, updated_at) VALUES
(
  'template-003',
  'CV Phong thái Lãnh đạo',
  'Chữ có chân (serif) đậm nét phù hợp cho các vị trí quản lý và lãnh đạo cấp cao.',
  '/templates/the-executive.png',
  NULL,
  'Professional',
  true,
  true,
  'two-column',
  95,
  1247,
  '1.0.0',
  '{"colors":{"text":{"body":"#2d2d2d","muted":"#6b6b6b","heading":"#000000"},"accent":"#1a1a1a","primary":"#000000","secondary":"#4a4a4a","background":{"page":"#ffffff","section":"#ffffff","sidebar":"#f5f5f5"}},"layout":{"maxWidth":"210mm","columnRatio":"30:70"},"spacing":{"page":{"margin":"20mm"},"element":{"gap":"16px"},"section":{"marginBottom":"28px"}},"typography":{"fonts":{"body":{"family":"Crimson Pro","weights":[400,500],"googleFont":true},"heading":{"family":"Cormorant Garamond","weights":[600,700],"googleFont":true}},"sizes":{"body":"13px","name":"38px","small":"11px","subsection":"17px","section_title":"24px"},"lineHeights":{"body":1.7,"heading":1.2}}}'::jsonb,
  '{"default_order":["personalInfo","experiences","education","skills"],"main_sections":["experiences","education"],"sidebar_sections":["personalInfo","skills"],"available_sections":[{"id":"personalInfo","icon":"user","type":"personalInfo","label":"Personal Information","layout":{"style":"compact"},"is_required":true,"is_visible_by_default":true},{"id":"experiences","icon":"briefcase","type":"experiences","label":"Professional Experience","layout":{"style":"detailed","showDates":true,"dateFormat":"MMMM YYYY","showCompanyLogo":false},"is_required":false,"is_visible_by_default":true},{"id":"education","icon":"graduation-cap","type":"education","label":"Education","layout":{"style":"condensed","showGPA":false},"is_required":false,"is_visible_by_default":true},{"id":"skills","icon":"award","type":"skills","label":"Core Competencies","layout":{"style":"list","columns":2,"showProficiency":false},"is_required":false,"is_visible_by_default":true}]}'::jsonb,
  ARRAY['Chuyên nghiệp', 'Lãnh đạo', 'Quản lý', 'Truyền thống'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category = EXCLUDED.category,
  layout_type = EXCLUDED.layout_type,
  is_premium = EXCLUDED.is_premium,
  design_config = EXCLUDED.design_config,
  sections_config = EXCLUDED.sections_config,
  tags = EXCLUDED.tags,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO templates (id, name, description, thumbnail_url, preview_pdf_url, category, is_premium, is_published, layout_type, popularity_score, usage_count, version, design_config, sections_config, tags, created_at, updated_at) VALUES
(
  'template-004',
  'CV Sáng tạo Chuyên nghiệp',
  'Thiết kế rực rỡ dành cho các chuyên gia sáng tạo.',
  '/templates/creative-pro.png',
  NULL,
  'Creative',
  false,
  true,
  'sidebar-right',
  87,
  892,
  '1.0.0',
  '{"colors":{"text":{"body":"#2e3440","muted":"#4c566a","heading":"#2e3440"},"accent":"#88c0d0","primary":"#5e81ac","secondary":"#81a1c1","background":{"page":"#ffffff","section":"#eceff4","sidebar":"#5e81ac"}},"layout":{"maxWidth":"210mm","columnRatio":"40:60"},"spacing":{"page":{"margin":"18mm"},"element":{"gap":"14px"},"section":{"marginBottom":"22px"}},"typography":{"fonts":{"body":{"family":"Raleway","weights":[400,500],"googleFont":true},"heading":{"family":"Montserrat","weights":[600,700,800],"googleFont":true}},"sizes":{"body":"14px","name":"34px","small":"12px","subsection":"16px","section_title":"22px"},"lineHeights":{"body":1.65,"heading":1.25}}}'::jsonb,
  '{"default_order":["personalInfo","experiences","projects","skills","education"],"main_sections":["experiences","projects","education"],"sidebar_sections":["personalInfo","skills"],"available_sections":[{"id":"personalInfo","icon":"user","type":"personalInfo","label":"About","layout":{"style":"creative"},"is_required":true,"is_visible_by_default":true},{"id":"experiences","icon":"briefcase","type":"experiences","label":"Experience","layout":{"style":"cards","showDates":true,"dateFormat":"MMM YYYY"},"is_required":false,"is_visible_by_default":true},{"id":"projects","icon":"layers","type":"projects","label":"Featured Projects","layout":{"style":"showcase","showThumbnails":true},"is_required":false,"is_visible_by_default":true},{"id":"skills","icon":"zap","type":"skills","label":"Skills & Tools","layout":{"style":"pills","columns":1,"showProficiency":true,"proficiencyStyle":"circles"},"is_required":false,"is_visible_by_default":true},{"id":"education","icon":"graduation-cap","type":"education","label":"Education","layout":{"style":"simple"},"is_required":false,"is_visible_by_default":true}]}'::jsonb,
  ARRAY['Sáng tạo', 'Thiết kế', 'Năng động', 'Hiện đại'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category = EXCLUDED.category,
  layout_type = EXCLUDED.layout_type,
  is_premium = EXCLUDED.is_premium,
  design_config = EXCLUDED.design_config,
  sections_config = EXCLUDED.sections_config,
  tags = EXCLUDED.tags,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO templates (id, name, description, thumbnail_url, preview_pdf_url, category, is_premium, is_published, layout_type, popularity_score, usage_count, version, design_config, sections_config, tags, created_at, updated_at) VALUES
(
  'template-005',
  'CV Tối ưu hóa ATS',
  'Định dạng đơn giản được tối ưu hóa cho Hệ thống Theo dõi Ứng viên (ATS).',
  '/templates/ats-optimized.png',
  NULL,
  'Simple',
  false,
  true,
  'single-column',
  92,
  1584,
  '1.0.0',
  '{"colors":{"text":{"body":"#000000","muted":"#333333","heading":"#000000"},"accent":"#000000","primary":"#000000","secondary":"#000000","background":{"page":"#ffffff","section":"#ffffff"}},"layout":{"maxWidth":"210mm"},"spacing":{"page":{"margin":"25mm"},"element":{"gap":"10px"},"section":{"marginBottom":"18px"}},"typography":{"fonts":{"body":{"family":"Arial","weights":[400],"googleFont":false},"heading":{"family":"Arial","weights":[700],"googleFont":false}},"sizes":{"body":"11pt","name":"16pt","small":"10pt","subsection":"12pt","section_title":"14pt"},"lineHeights":{"body":1.5,"heading":1.2}}}'::jsonb,
  '{"default_order":["personalInfo","experiences","education","skills","certifications"],"available_sections":[{"id":"personalInfo","type":"personalInfo","label":"Contact Information","layout":{"style":"simple"},"is_required":true,"is_visible_by_default":true},{"id":"experiences","type":"experiences","label":"Work Experience","layout":{"style":"bullets","showDates":true,"dateFormat":"MM/YYYY"},"is_required":false,"is_visible_by_default":true},{"id":"education","type":"education","label":"Education","layout":{"style":"simple","showGPA":true},"is_required":false,"is_visible_by_default":true},{"id":"skills","type":"skills","label":"Skills","layout":{"style":"comma-separated","showProficiency":false},"is_required":false,"is_visible_by_default":true},{"id":"certifications","type":"certifications","label":"Certifications","layout":{"style":"list"},"is_required":false,"is_visible_by_default":false}]}'::jsonb,
  ARRAY['ATS Friendly', 'Đơn giản', 'Tiêu chuẩn', 'Tối giản'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category = EXCLUDED.category,
  layout_type = EXCLUDED.layout_type,
  is_premium = EXCLUDED.is_premium,
  design_config = EXCLUDED.design_config,
  sections_config = EXCLUDED.sections_config,
  tags = EXCLUDED.tags,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO templates (id, name, description, thumbnail_url, preview_pdf_url, category, is_premium, is_published, layout_type, popularity_score, usage_count, version, design_config, sections_config, tags, created_at, updated_at) VALUES
(
  'template-006',
  'CV Kỹ sư Công nghệ',
  'Bản lý lịch kỹ thuật sạch sẽ dành cho các kỹ sư phần mềm.',
  '/templates/tech-engineer.png',
  NULL,
  'Technical',
  false,
  true,
  'sidebar-left',
  89,
  1156,
  '1.0.0',
  '{"colors":{"text":{"body":"#1f2937","muted":"#6b7280","heading":"#111827"},"accent":"#10b981","primary":"#059669","secondary":"#047857","background":{"page":"#ffffff","section":"#f9fafb","sidebar":"#111827"}},"layout":{"maxWidth":"210mm","columnRatio":"33:67"},"spacing":{"page":{"margin":"18mm"},"element":{"gap":"12px"},"section":{"marginBottom":"20px"}},"typography":{"fonts":{"body":{"family":"Roboto Mono","weights":[400,500],"googleFont":true},"heading":{"family":"Fira Code","weights":[600,700],"googleFont":true}},"sizes":{"body":"13px","name":"30px","small":"11px","subsection":"15px","section_title":"19px"},"lineHeights":{"body":1.6,"heading":1.3}}}'::jsonb,
  '{"default_order":["personalInfo","experiences","projects","skills","education","certifications"],"main_sections":["experiences","projects","education"],"sidebar_sections":["personalInfo","skills","certifications"],"available_sections":[{"id":"personalInfo","icon":"terminal","type":"personalInfo","label":"Contact","layout":{"style":"compact"},"is_required":true,"is_visible_by_default":true},{"id":"experiences","icon":"code","type":"experiences","label":"Experience","layout":{"style":"technical","showDates":true,"dateFormat":"MMM YYYY","showTechStack":true},"is_required":false,"is_visible_by_default":true},{"id":"projects","icon":"git-branch","type":"projects","label":"Projects","layout":{"style":"detailed","showLinks":true,"showTechStack":true},"is_required":false,"is_visible_by_default":true},{"id":"skills","icon":"cpu","type":"skills","label":"Technical Skills","layout":{"style":"categorized","categories":["Languages","Frameworks","Tools","Databases"],"showProficiency":false},"is_required":false,"is_visible_by_default":true},{"id":"education","icon":"book-open","type":"education","label":"Education","layout":{"style":"simple","showGPA":true},"is_required":false,"is_visible_by_default":true},{"id":"certifications","icon":"award","type":"certifications","label":"Certifications","layout":{"style":"badges"},"is_required":false,"is_visible_by_default":true}]}'::jsonb,
  ARRAY['Kỹ thuật', 'Kỹ sư', 'Lập trình viên', 'Sạch sẽ'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category = EXCLUDED.category,
  layout_type = EXCLUDED.layout_type,
  is_premium = EXCLUDED.is_premium,
  design_config = EXCLUDED.design_config,
  sections_config = EXCLUDED.sections_config,
  tags = EXCLUDED.tags,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO templates (id, name, description, thumbnail_url, preview_pdf_url, category, is_premium, is_published, layout_type, popularity_score, usage_count, version, design_config, sections_config, tags, created_at, updated_at) VALUES
(
  'template-007',
  'CV Học giả Hàn lâm',
  'Định dạng CV học thuật truyền thống.',
  '/templates/academic-scholar.png',
  NULL,
  'Academic',
  true,
  true,
  'single-column',
  78,
  423,
  '1.0.0',
  '{"colors":{"text":{"body":"#1a1a1a","muted":"#4a4a4a","heading":"#000000"},"accent":"#8b4513","primary":"#000000","secondary":"#2d2d2d","background":{"page":"#ffffff","section":"#ffffff"}},"layout":{"maxWidth":"210mm"},"spacing":{"page":{"margin":"25mm"},"element":{"gap":"14px"},"section":{"marginBottom":"24px"}},"typography":{"fonts":{"body":{"family":"Merriweather","weights":[400],"googleFont":true},"heading":{"family":"Merriweather","weights":[700,900],"googleFont":true}},"sizes":{"body":"12pt","name":"20pt","small":"10pt","subsection":"14pt","section_title":"16pt"},"lineHeights":{"body":1.8,"heading":1.3}}}'::jsonb,
  '{"default_order":["personalInfo","education","research","publications","teaching","awards","conferences","references"],"available_sections":[{"id":"personalInfo","type":"personalInfo","label":"Personal Information","layout":{"style":"centered"},"is_required":true,"is_visible_by_default":true},{"id":"education","type":"education","label":"Education","layout":{"style":"detailed","showThesis":true,"showAdvisor":true},"is_required":false,"is_visible_by_default":true},{"id":"research","type":"research","label":"Research Experience","layout":{"style":"detailed"},"is_required":false,"is_visible_by_default":true},{"id":"publications","type":"publications","label":"Publications","layout":{"style":"apa","showDOI":true},"is_required":false,"is_visible_by_default":true},{"id":"teaching","type":"teaching","label":"Teaching Experience","layout":{"style":"detailed"},"is_required":false,"is_visible_by_default":true},{"id":"awards","type":"awards","label":"Honors & Awards","layout":{"style":"chronological"},"is_required":false,"is_visible_by_default":true},{"id":"conferences","type":"conferences","label":"Conferences & Presentations","layout":{"style":"detailed"},"is_required":false,"is_visible_by_default":false},{"id":"references","type":"references","label":"References","layout":{"style":"full-contact"},"is_required":false,"is_visible_by_default":true}]}'::jsonb,
  ARRAY['Học thuật', 'Truyền thống', 'Nghiên cứu', 'Học giả'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category = EXCLUDED.category,
  layout_type = EXCLUDED.layout_type,
  is_premium = EXCLUDED.is_premium,
  design_config = EXCLUDED.design_config,
  sections_config = EXCLUDED.sections_config,
  tags = EXCLUDED.tags,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO templates (id, name, description, thumbnail_url, preview_pdf_url, category, is_premium, is_published, layout_type, popularity_score, usage_count, version, design_config, sections_config, tags, created_at, updated_at) VALUES
(
  'template-008',
  'CV Nhà sáng lập Startup',
  'Mẫu CV năng động dành cho các doanh nhân và nhà sáng lập startup.',
  '/templates/startup-founder.png',
  NULL,
  'Modern',
  true,
  true,
  'two-column',
  84,
  678,
  '1.0.0',
  '{"colors":{"text":{"body":"#1e293b","muted":"#64748b","heading":"#0f172a"},"accent":"#f59e0b","primary":"#ea580c","secondary":"#dc2626","background":{"page":"#ffffff","section":"#fef3c7","sidebar":"#0f172a"}},"layout":{"maxWidth":"210mm","columnRatio":"35:65"},"spacing":{"page":{"margin":"18mm"},"element":{"gap":"14px"},"section":{"marginBottom":"24px"}},"typography":{"fonts":{"body":{"family":"DM Sans","weights":[400,500],"googleFont":true},"heading":{"family":"DM Sans","weights":[700,900],"googleFont":true}},"sizes":{"body":"14px","name":"36px","small":"12px","subsection":"18px","section_title":"22px"},"lineHeights":{"body":1.65,"heading":1.2}}}'::jsonb,
  '{"default_order":["personalInfo","experiences","achievements","skills","education"],"main_sections":["experiences","achievements"],"sidebar_sections":["personalInfo","skills","education"],"available_sections":[{"id":"personalInfo","icon":"rocket","type":"personalInfo","label":"Profile","layout":{"style":"bold"},"is_required":true,"is_visible_by_default":true},{"id":"experiences","icon":"briefcase","type":"experiences","label":"Leadership Roles","layout":{"style":"impact","showDates":true,"dateFormat":"YYYY"},"is_required":false,"is_visible_by_default":true},{"id":"achievements","icon":"trophy","type":"achievements","label":"Key Achievements","layout":{"style":"metrics"},"is_required":false,"is_visible_by_default":true},{"id":"skills","icon":"lightbulb","type":"skills","label":"Expertise","layout":{"style":"tags","showProficiency":false},"is_required":false,"is_visible_by_default":true},{"id":"education","icon":"graduation-cap","type":"education","label":"Education","layout":{"style":"compact"},"is_required":false,"is_visible_by_default":true}]}'::jsonb,
  ARRAY['Hiện đại', 'Startup', 'Năng động', 'Doanh nhân'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  category = EXCLUDED.category,
  layout_type = EXCLUDED.layout_type,
  is_premium = EXCLUDED.is_premium,
  design_config = EXCLUDED.design_config,
  sections_config = EXCLUDED.sections_config,
  tags = EXCLUDED.tags,
  updated_at = CURRENT_TIMESTAMP;
