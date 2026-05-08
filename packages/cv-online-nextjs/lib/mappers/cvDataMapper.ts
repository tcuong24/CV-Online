import { uid } from '@/constants/cvEditor';
import { CvData } from '@/types/cvEditor';

// ─── Language level mapping ───────────────────────────────────────────────────

/**
 * Maps DB proficiency strings (CEFR or descriptive) → editor numeric level 1–5.
 * Unmapped values default to 3 (intermediate).
 */
export const PROFICIENCY_TO_LEVEL: Record<string, number> = {
  'A1': 1, 'A2': 1,
  'B1': 2, 'B2': 3,
  'C1': 4, 'C2': 5,
  'beginner':           1,
  'elementary':         2,
  'intermediate':       3,
  'upper-intermediate': 4,
  'advanced':           5,
  'native':             5,
  'proficient':         5,
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

function toYearString(date: string | Date | null | undefined, fallback = ''): string {
  if (!date) return fallback;
  try {
    return new Date(date).getFullYear().toString();
  } catch {
    return fallback;
  }
}

// ─── Main mapper ─────────────────────────────────────────────────────────────

/**
 * Maps a raw DB CV response (as returned by the NestJS API) into the
 * `CvData` shape consumed by the editor and template components.
 *
 * Only the fields the editor currently supports are mapped; richer DB
 * fields (achievements, isCurrent, linkedinUrl, etc.) are intentionally
 * dropped until the editor adds those fields.
 */
export function mapDbCvToCvData(dbCv: Record<string, unknown>): CvData {
  // ── Personal ──
  const pi = (dbCv['personalInfo'] ?? {}) as Record<string, unknown>;

  // ── Experience ──
  const experiences = ((dbCv['experiences'] ?? []) as Record<string, unknown>[]).map((e) => ({
    id:       (e['id'] as string | undefined) ?? uid(),
    _dbId:    e['id'] as string | undefined,
    title:    (e['position']    as string | undefined) ?? '',
    company:  (e['companyName'] as string | undefined) ?? '',
    location: (e['location']    as string | undefined) ?? '',
    from:     toYearString(e['startDate'] as string | undefined),
    to:       e['isCurrent'] ? 'Hiện tại' : toYearString(e['endDate'] as string | undefined, 'Hiện tại'),
    desc:     (e['description'] as string | undefined) ?? '',
    open:     false,
  }));

  // ── Education ──
  const education = ((dbCv['education'] ?? []) as Record<string, unknown>[]).map((e) => ({
    id:     (e['id']              as string | undefined) ?? uid(),
    _dbId:  e['id'] as string | undefined,
    degree: (e['degree']          as string | undefined) ?? '',
    school: (e['institutionName'] as string | undefined) ?? '',
    from:   toYearString(e['startDate'] as string | undefined),
    to:     e['isCurrent'] ? 'Hiện tại' : toYearString(e['endDate'] as string | undefined, 'Hiện tại'),
    desc:   (e['description'] as string | undefined) ?? '',
    open:   false,
  }));

  // ── Skills ──
  const skills = ((dbCv['skills'] ?? []) as Record<string, unknown>[]).map((s) => ({
    id:                     (s['id'] as string | undefined) ?? uid(),
    _dbId:                  s['id'] as string | undefined,
    name:                   (s['skillName'] as string | undefined) ?? '',
    proficiencyLevel:       (s['proficiencyLevel'] as string | undefined) ?? '',
    proficiencyPercentage:  (s['proficiencyPercentage'] as number | undefined) ?? 0,
    category:               (s['category'] as string | undefined) ?? '',
  }));

  // ── Projects ──
  const projects = ((dbCv['projects'] ?? []) as Record<string, unknown>[]).map((p) => ({
    id:   (p['id']          as string | undefined) ?? uid(),
    _dbId: p['id'] as string | undefined,
    name: (p['projectName'] as string | undefined) ?? '',
    role: (p['role']        as string | undefined) ?? '',
    tech: ((p['technologies'] as string[] | undefined) ?? []).join(', '),
    link: (p['projectUrl']  as string | undefined) ?? '',
    desc: (p['description'] as string | undefined) ?? '',
    open: false,
  }));

  // ── Awards ──
  const awards = ((dbCv['awards'] ?? []) as Record<string, unknown>[]).map((a) => ({
    id:   (a['id']    as string | undefined) ?? uid(),
    _dbId: a['id'] as string | undefined,
    title: (a['title'] as string | undefined) ?? '',
    org:  (a['issuer'] as string | undefined) ?? '',
    year: toYearString(a['dateReceived'] as string | undefined),
    open: false,
  }));

  // ── Certifications ──
  const certifications = ((dbCv['certifications'] ?? []) as Record<string, unknown>[]).map((c) => ({
    id:                   (c['id']                   as string | undefined) ?? uid(),
    _dbId:                c['id'] as string | undefined,
    name:                 (c['name']                 as string | undefined) ?? '',
    issuingOrganization:  (c['issuingOrganization']  as string | undefined) ?? '',
    issueDate:            toYearString(c['issueDate'] as string | undefined),
    expiryDate:           toYearString(c['expiryDate'] as string | undefined),
    credentialId:         (c['credentialId']          as string | undefined) ?? '',
    credentialUrl:        (c['credentialUrl']         as string | undefined) ?? '',
    description:          (c['description']           as string | undefined) ?? '',
    open: false,
  }));

  // ── Languages ──
  const languages = ((dbCv['languages'] ?? []) as Record<string, unknown>[]).map((l) => ({
    id:    (l['id']           as string | undefined) ?? uid(),
    _dbId: l['id'] as string | undefined,
    lang:  (l['languageName'] as string | undefined) ?? '',
    level: PROFICIENCY_TO_LEVEL[(l['proficiencyLevel'] as string | undefined) ?? ''] ?? 3,
  }));

  // ── References ──
  const references = ((dbCv['references'] ?? []) as Record<string, unknown>[]).map((r) => ({
    id:           (r['id']           as string | undefined) ?? uid(),
    _dbId:        r['id'] as string | undefined,
    fullName:     (r['fullName']     as string | undefined) ?? '',
    jobTitle:     (r['jobTitle']     as string | undefined) ?? '',
    company:      (r['company']      as string | undefined) ?? '',
    relationship: (r['relationship'] as string | undefined) ?? '',
    email:        (r['email']        as string | undefined) ?? '',
    phone:        (r['phone']        as string | undefined) ?? '',
    open: false,
  }));

  // ── Interests ──
  const interests = ((dbCv['interests'] ?? []) as Record<string, unknown>[]).map((i) => ({
    id:   (i['id']   as string | undefined) ?? uid(),
    _dbId: i['id'] as string | undefined,
    name: (i['name'] as string | undefined) ?? '',
  }));

  // ── Activities ──
  const activities = ((dbCv['activities'] ?? []) as Record<string, unknown>[]).map((a) => ({
    id:          (a['id']          as string | undefined) ?? uid(),
    _dbId:       a['id'] as string | undefined,
    name:        (a['name']        as string | undefined) ?? '',
    role:        (a['role']        as string | undefined) ?? '',
    startDate:   toYearString(a['startDate'] as string | undefined),
    endDate:     toYearString(a['endDate'] as string | undefined),
    description: (a['description'] as string | undefined) ?? '',
    open: false,
  }));
  
  // ── Custom Sections ──
  const blockedTitles = [
    'summary', 'tóm tắt', 'giới thiệu', 'profile',
    'education', 'educations', 'học vấn', 'trình độ học vấn',
    'experience', 'experiences', 'kinh nghiệm', 'kinh nghiệm làm việc',
    'skills', 'kỹ năng',
    'projects', 'dự án',
    'awards', 'giải thưởng',
    'certifications', 'chứng chỉ',
    'languages', 'ngoại ngữ', 'ngôn ngữ'
  ];

  const customSections = ((dbCv['customSections'] ?? []) as Record<string, unknown>[])
    .filter(cs => {
      const title = ((cs['sectionTitle'] as string) || '').toLowerCase().trim();
      return !blockedTitles.includes(title);
    })
    .map((cs) => {
      const content = cs['content'] as any;
      const items = Array.isArray(content) ? content : (content?.items ?? []);
      const fieldConfig = Array.isArray(content) ? undefined : content?.fieldConfig;

      return {
        id:           (cs['id']           as string | undefined) ?? uid(),
        _dbId:        cs['id'] as string,
        sectionTitle: (cs['sectionTitle'] as string | undefined) ?? '',
        sectionType:  ((cs['sectionType'] as string) || 'list') as 'list' | 'timeline' | 'tags' | 'text' | 'grid',
        items:        items.map((item: any) => ({
          ...item,
          open: false,
        })),
        fieldConfig:  fieldConfig,
      };
    });

  return {
    personal: {
      // DB field → editor field, với fallback về editor field name
      // (trường hợp personalInfo đã là editor type, e.g. local CV từ TemplateGrid)
      name:         ((pi['fullName']  ?? pi['name'])       as string | undefined) ?? '',
      role:         ((pi['jobTitle']  ?? pi['role'])        as string | undefined) ?? '',
      email:        (pi['email']       as string | undefined) ?? '',
      phone:        (pi['phone']       as string | undefined) ?? '',
      location:     (pi['location']    as string | undefined) ?? '',
      website:      (pi['website']     as string | undefined) ?? '',
      summary:      (pi['summary']     as string | undefined) ?? '',
      avatarUrl:    ((pi['photoUrl']  ?? pi['avatarUrl'])  as string | undefined) ?? null,
      linkedinUrl:  (pi['linkedinUrl'] as string | undefined) ?? null,
      githubUrl:    (pi['githubUrl']   as string | undefined) ?? null,
      portfolioUrl: (pi['portfolioUrl'] as string | undefined) ?? null,
      twitterUrl:   (pi['twitterUrl']  as string | undefined) ?? null,
      facebookUrl:  (pi['facebookUrl'] as string | undefined) ?? null,
      dateOfBirth:  pi['dateOfBirth']
        ? new Date(pi['dateOfBirth'] as string).toISOString().split('T')[0]
        : null,
      nationality:  (pi['nationality'] as string | undefined) ?? null,
    },
    experiences,
    education,
    skills,
    projects,
    awards,
    certifications,
    languages,
    references,
    interests,
    activities,
    customSections,
  };
}
