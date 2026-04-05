// import Summary from "./sections/Summary";
// import Experience from "./sections/Experience";
// import { CV } from "@/types/cv";
// import Header from "./sections/Header";

// type Props = { cv: CV };

// export default function ModernTemplate({ cv }: Props) {
//   return (
//     <div className="cv-root" style={{ ['--cv-color' as any]: cv.color, fontFamily: cv.font }}>
//       <div className="cv-container" style={{ width: 800, margin: '0 auto', padding: 24 }}>
//         <Header profile={cv.user?.userProfiles?.[0]} title={cv.title} />
//         <Summary section={cv.sections?.find(s => s.type === 'summary')} />
//         <Experience experiences={cv.experiences} />
//       </div>
//     </div>
//   );
// }
