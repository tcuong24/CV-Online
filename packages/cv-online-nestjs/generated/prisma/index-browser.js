
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  fullName: 'fullName',
  avatarUrl: 'avatarUrl',
  phone: 'phone',
  role: 'role',
  subscriptionType: 'subscriptionType',
  subscriptionExpiresAt: 'subscriptionExpiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastLoginAt: 'lastLoginAt'
};

exports.Prisma.TemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  thumbnailUrl: 'thumbnailUrl',
  previewPdfUrl: 'previewPdfUrl',
  category: 'category',
  isPremium: 'isPremium',
  isPublished: 'isPublished',
  popularityScore: 'popularityScore',
  usageCount: 'usageCount',
  layoutType: 'layoutType',
  designConfig: 'designConfig',
  sectionsConfig: 'sectionsConfig',
  version: 'version',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  tags: 'tags'
};

exports.Prisma.TemplateSampleDataScalarFieldEnum = {
  id: 'id',
  templateId: 'templateId',
  sampleData: 'sampleData',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CVScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  templateId: 'templateId',
  title: 'title',
  slug: 'slug',
  isPublic: 'isPublic',
  publicUrlToken: 'publicUrlToken',
  status: 'status',
  customStyles: 'customStyles',
  sectionsVisibility: 'sectionsVisibility',
  sectionsOrder: 'sectionsOrder',
  sectionsLayout: 'sectionsLayout',
  viewCount: 'viewCount',
  downloadCount: 'downloadCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  publishedAt: 'publishedAt',
  thumbnailUrl: 'thumbnailUrl'
};

exports.Prisma.CVPersonalInfoScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  fullName: 'fullName',
  jobTitle: 'jobTitle',
  email: 'email',
  phone: 'phone',
  location: 'location',
  dateOfBirth: 'dateOfBirth',
  nationality: 'nationality',
  photoUrl: 'photoUrl',
  website: 'website',
  linkedinUrl: 'linkedinUrl',
  githubUrl: 'githubUrl',
  portfolioUrl: 'portfolioUrl',
  twitterUrl: 'twitterUrl',
  facebookUrl: 'facebookUrl',
  summary: 'summary',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CVExperienceScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  companyName: 'companyName',
  position: 'position',
  location: 'location',
  companyWebsite: 'companyWebsite',
  startDate: 'startDate',
  endDate: 'endDate',
  isCurrent: 'isCurrent',
  description: 'description',
  achievements: 'achievements',
  technologies: 'technologies',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CVEducationScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  institutionName: 'institutionName',
  degree: 'degree',
  fieldOfStudy: 'fieldOfStudy',
  location: 'location',
  startDate: 'startDate',
  endDate: 'endDate',
  isCurrent: 'isCurrent',
  gpa: 'gpa',
  description: 'description',
  achievements: 'achievements',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CVSkillScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  category: 'category',
  skillName: 'skillName',
  proficiencyLevel: 'proficiencyLevel',
  proficiencyPercentage: 'proficiencyPercentage',
  yearsOfExperience: 'yearsOfExperience',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CVProjectScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  projectName: 'projectName',
  role: 'role',
  startDate: 'startDate',
  endDate: 'endDate',
  isOngoing: 'isOngoing',
  description: 'description',
  achievements: 'achievements',
  technologies: 'technologies',
  projectUrl: 'projectUrl',
  githubUrl: 'githubUrl',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CVCertificationScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  name: 'name',
  issuingOrganization: 'issuingOrganization',
  issueDate: 'issueDate',
  expiryDate: 'expiryDate',
  credentialId: 'credentialId',
  credentialUrl: 'credentialUrl',
  description: 'description',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CVLanguageScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  languageName: 'languageName',
  proficiencyLevel: 'proficiencyLevel',
  canRead: 'canRead',
  canWrite: 'canWrite',
  canSpeak: 'canSpeak',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CVAwardScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  title: 'title',
  issuer: 'issuer',
  dateReceived: 'dateReceived',
  description: 'description',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CVReferenceScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  fullName: 'fullName',
  jobTitle: 'jobTitle',
  company: 'company',
  relationship: 'relationship',
  email: 'email',
  phone: 'phone',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CVCustomSectionScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  sectionTitle: 'sectionTitle',
  sectionType: 'sectionType',
  content: 'content',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CVInterestScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  name: 'name',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CVActivityScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  name: 'name',
  role: 'role',
  startDate: 'startDate',
  endDate: 'endDate',
  description: 'description',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CVRenderedCacheScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  cacheKey: 'cacheKey',
  htmlContent: 'htmlContent',
  cssContent: 'cssContent',
  templateId: 'templateId',
  templateVersion: 'templateVersion',
  fileSize: 'fileSize',
  renderTimeMs: 'renderTimeMs',
  expiresAt: 'expiresAt',
  hitCount: 'hitCount',
  createdAt: 'createdAt',
  lastAccessedAt: 'lastAccessedAt'
};

exports.Prisma.CVExportScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  userId: 'userId',
  exportType: 'exportType',
  fileUrl: 'fileUrl',
  fileSize: 'fileSize',
  exportOptions: 'exportOptions',
  status: 'status',
  errorMessage: 'errorMessage',
  createdAt: 'createdAt',
  completedAt: 'completedAt'
};

exports.Prisma.CVVersionScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  versionNumber: 'versionNumber',
  snapshotData: 'snapshotData',
  createdBy: 'createdBy',
  createdAt: 'createdAt'
};

exports.Prisma.CVShareScalarFieldEnum = {
  id: 'id',
  cvId: 'cvId',
  shareToken: 'shareToken',
  shareType: 'shareType',
  recipientEmail: 'recipientEmail',
  expiresAt: 'expiresAt',
  viewCount: 'viewCount',
  lastViewedAt: 'lastViewedAt',
  createdAt: 'createdAt'
};

exports.Prisma.AnalyticsEventScalarFieldEnum = {
  id: 'id',
  eventType: 'eventType',
  userId: 'userId',
  cvId: 'cvId',
  templateId: 'templateId',
  metadata: 'metadata',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
  user: 'user',
  admin: 'admin'
};

exports.Prisma.ModelName = {
  User: 'User',
  Template: 'Template',
  TemplateSampleData: 'TemplateSampleData',
  CV: 'CV',
  CVPersonalInfo: 'CVPersonalInfo',
  CVExperience: 'CVExperience',
  CVEducation: 'CVEducation',
  CVSkill: 'CVSkill',
  CVProject: 'CVProject',
  CVCertification: 'CVCertification',
  CVLanguage: 'CVLanguage',
  CVAward: 'CVAward',
  CVReference: 'CVReference',
  CVCustomSection: 'CVCustomSection',
  CVInterest: 'CVInterest',
  CVActivity: 'CVActivity',
  CVRenderedCache: 'CVRenderedCache',
  CVExport: 'CVExport',
  CVVersion: 'CVVersion',
  CVShare: 'CVShare',
  AnalyticsEvent: 'AnalyticsEvent'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
