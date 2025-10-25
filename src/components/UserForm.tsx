import { useState, FormEvent } from 'react';
import { UserProfile, NewUserProfile } from '../lib/supabase';
import FormInput, { FormTextArea, FormSelect } from './FormInput';
import Spinner from './Spinner';

interface UserFormProps {
  user?: UserProfile;
  onSubmit: (userData: NewUserProfile) => Promise<void>;
  onCancel: () => void;
}

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<NewUserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'User',
    avatar: user?.avatar || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    dob: user?.dob || '',
    address: user?.address || '',
    domicile: user?.domicile || '',
    education: {
      college: user?.education?.college || '',
      degree: user?.education?.degree || '',
      course: user?.education?.course || '',
      year: user?.education?.year || '',
      grade: user?.education?.grade || ''
    },
    skills: user?.skills || [],
    projects: user?.projects || [],
    experience: {
      domain: user?.experience?.domain || '',
      subDomain: user?.experience?.subDomain || '',
      years: user?.experience?.years || ''
    }
  });

  const [skillInput, setSkillInput] = useState('');
  const [projectInput, setProjectInput] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter((s) => s !== skill) || []
    });
  };

  const addProject = () => {
    if (projectInput.trim() && !formData.projects?.includes(projectInput.trim())) {
      setFormData({
        ...formData,
        projects: [...(formData.projects || []), projectInput.trim()]
      });
      setProjectInput('');
    }
  };

  const removeProject = (project: string) => {
    setFormData({
      ...formData,
      projects: formData.projects?.filter((p) => p !== project) || []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />
            <FormInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
            />
            <FormSelect
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              options={[
                { value: 'User', label: 'User' },
                { value: 'Admin', label: 'Admin' },
                { value: 'Moderator', label: 'Moderator' }
              ]}
              required
            />
            <FormInput
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              placeholder="1234567890"
            />
            <FormSelect
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]}
            />
            <FormInput
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
            <FormInput
              label="Avatar URL"
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
            <FormInput
              label="Domicile"
              value={formData.domicile}
              onChange={(e) => setFormData({ ...formData, domicile: e.target.value })}
              placeholder="Maharashtra"
            />
          </div>
          <div className="mt-4">
            <FormTextArea
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter full address"
              rows={2}
            />
          </div>
        </div>

        {formData.avatar && (
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Avatar Preview</p>
            <img
              src={formData.avatar}
              alt="Avatar preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=random`;
              }}
            />
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Education</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="College/University"
              value={formData.education?.college}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  education: { ...formData.education, college: e.target.value }
                })
              }
              placeholder="IIT Bombay"
            />
            <FormInput
              label="Degree"
              value={formData.education?.degree}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  education: { ...formData.education, degree: e.target.value }
                })
              }
              placeholder="B.Tech"
            />
            <FormInput
              label="Course"
              value={formData.education?.course}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  education: { ...formData.education, course: e.target.value }
                })
              }
              placeholder="Computer Science"
            />
            <FormInput
              label="Year"
              value={formData.education?.year}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  education: { ...formData.education, year: e.target.value }
                })
              }
              placeholder="2020"
            />
            <FormInput
              label="Grade"
              value={formData.education?.grade}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  education: { ...formData.education, grade: e.target.value }
                })
              }
              placeholder="A+"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills & Projects</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill and press Enter"
                  className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-blue-900 dark:hover:text-blue-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Projects
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={projectInput}
                  onChange={(e) => setProjectInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProject())}
                  placeholder="Add a project and press Enter"
                  className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addProject}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.projects?.map((project) => (
                  <span
                    key={project}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm"
                  >
                    {project}
                    <button
                      type="button"
                      onClick={() => removeProject(project)}
                      className="hover:text-green-900 dark:hover:text-green-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Domain"
              value={formData.experience?.domain}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experience: { ...formData.experience, domain: e.target.value }
                })
              }
              placeholder="Web Development"
            />
            <FormInput
              label="Sub-Domain"
              value={formData.experience?.subDomain}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experience: { ...formData.experience, subDomain: e.target.value }
                })
              }
              placeholder="MERN Stack"
            />
            <FormSelect
              label="Years of Experience"
              value={formData.experience?.years}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experience: { ...formData.experience, years: e.target.value }
                })
              }
              options={[
                { value: '', label: 'Select Experience' },
                { value: '0-1', label: '0-1 years' },
                { value: '1-3', label: '1-3 years' },
                { value: '3-5', label: '3-5 years' },
                { value: '5+', label: '5+ years' }
              ]}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              Saving...
            </>
          ) : (
            user ? 'Update User' : 'Create User'
          )}
        </button>
      </div>
    </form>
  );
}
