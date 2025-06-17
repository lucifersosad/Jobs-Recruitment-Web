import { Document, Page, Text, View, Font } from '@react-pdf/renderer';
import { decode } from 'html-entities';
import DOMPurify from 'dompurify';
import { createTw } from 'react-pdf-tailwind';
import BeVietnam from '/fonts/BeVietnamPro-Regular.ttf';

Font.register({
  family: 'BeVietnam',
  src: BeVietnam,
});

const tw = createTw({
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        accent: '#3b82f6',
        muted: '#64748b',
      },
    },
  },
});

const BulletedList = ({ items }) => (
  <View>
    {items.map((item, index) => (
      <View style={tw('flex flex-row flex-wrap items-center gap-1 flex-nowrap')} key={index}>
        <Text style={tw('text-accent')}>•</Text>
        <Text style={[tw('text-sm'), { flex: 1 }]}>{item.name}</Text>
      </View>
    ))}
  </View>
);

const HeaderSection = () => <View fixed style={tw('h-4 w-full bg-primary')} />;

export default function ResumeTemplateTwo({ formData }) {
  console.log('Template Two Rendering with data:', formData);
  
  const parseHTMLToList = (html) => {
  const clean = DOMPurify.sanitize(html);
  const container = document.createElement('div');
  container.innerHTML = clean;

  const listItems = [...container.querySelectorAll('li')];
  return listItems.map((li) => li.textContent.trim());
};

  return (
    <Document>
      <Page size="A4" style={[tw('p-6'), { fontFamily: 'BeVietnam' } ]}>
        <HeaderSection />

        {/* Header Section */}
        <View style={tw('mt-6 text-center mb-6')}>
          <Text style={tw('text-3xl font-bold text-primary')}>
            {formData.fullName ?? 'Họ và tên'}
          </Text>
          <View style={tw('flex flex-row justify-center gap-4 mt-[-10px]')}>
            <Text style={tw('text-sm text-muted')}>
              {formData?.email ?? 'Email'}
            </Text>
            <Text style={tw('text-sm text-muted')}>
              {formData?.phone}
            </Text>
            <Text style={tw('text-sm text-muted')}>
              {formData?.address}
            </Text>
          </View>
        </View>

        {/* Summary Section */}
        <View style={tw('mb-6')}>
          <Text style={tw('text-lg font-bold text-primary mb-2')}>
            Mục tiêu nghề nghiệp
          </Text>
          <Text style={tw('text-sm')}>
            {formData?.objective}
          </Text>
        </View>

        {/* Two Column Layout */}
        <View style={tw('flex flex-row')}>
          {/* Left Column */}
          <View style={tw('w-2/3 pr-4')}>
            {/* Work Experience */}
            <View style={tw('mb-6')}>
              <Text style={tw('text-lg font-bold text-primary mb-2')}>
                Kinh nghiệm làm việc
              </Text>
              <View style={tw('flex flex-col gap-4')}>
                {formData?.experiences?.length &&
                  formData.experiences.map((experience, index) => (
                    <View wrap={false} key={index} style={tw('flex flex-col gap-2')}>
                      <Text style={tw('font-bold text-base')}>
                        {experience?.position_name ?? 'Vị trí'}
                      </Text>
                      <Text style={tw('text-sm text-muted')}>
                        {experience?.company_name ?? 'Công ty'} | {experience?.start_date ?? 'Bắt đầu'} -{' '}
                        {experience?.end_date ?? 'Kết thúc'}
                      </Text>
                      <BulletedList items={parseHTMLToList(experience?.description ?? '').map(item => ({ name: item }))} />
                    </View>
                  ))}
              </View>
            </View>

            {/* Education */}
            <View style={tw('mb-6')}>
              <Text style={tw('text-lg font-bold text-primary mb-2')}>
                Học vấn
              </Text>
              <View style={tw('flex flex-col gap-4')}>
                {formData?.educations?.length &&
                  formData.educations.map((edu, index) => (
                    <View key={index} style={tw('flex flex-col gap-2')}>
                      <Text style={tw('font-bold text-base')}>
                        {edu?.title ?? 'Chuyên ngành'}
                      </Text>
                      <Text style={tw('text-sm text-muted')}>
                        {edu?.school_name ?? 'School'} | {edu?.start_date ?? 'Bắt đầu'} -{' '}
                        {edu?.end_date ?? 'Kết thúc'}
                      </Text>
                      <BulletedList items={parseHTMLToList(edu?.description ?? '').map(item => ({ name: item }))} />
                    </View>
                  ))}
              </View>
            </View>
          </View>

          {/* Right Column */}
          <View style={tw('w-1/3 pl-4 border-l')}>
            {/* Skills Section */}
            <View style={tw('mb-6')}>
              <Text style={tw('text-lg font-bold text-primary mb-2')}>
                Kỹ năng
              </Text>
              <BulletedList
                items={
                  formData?.skills?.map(skill => ({ name: skill.skill_name })) ?? []
                }
              />
            </View>

            {/* Languages Section */}
            <View style={tw('mb-6')}>
              <Text style={tw('text-lg font-bold text-primary mb-2')}>
                Ngôn ngữ
              </Text>
              <BulletedList
                items={
                  formData?.languages?.map(lang => ({ name: lang.lang_name })) ?? []
                }
              />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
