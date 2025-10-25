import { useState } from 'react';
import { User, GraduationCap, Briefcase, Mail, Phone, MapPin, Calendar, X } from 'lucide-react';
import { UserProfile as UserProfileType } from '../lib/supabase';
import Tabs, { Tab } from './Tabs';

interface UserProfileProps {
  user: UserProfileType;
  onClose: () => void;
}

export default function UserProfile({ user, onClose }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'User':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Moderator':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const tabs: Tab[] = [
    {
      id: 'basic',
      label: 'Basic Info',
      icon: <User className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Full Name
              </label>
              <p className="text-base text-gray-900 dark:text-white font-medium">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Role
              </label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>
            {user.email && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <p className="text-base text-gray-900 dark:text-white">{user.email}</p>
              </div>
            )}
            {user.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone
                </label>
                <p className="text-base text-gray-900 dark:text-white">{user.phone}</p>
              </div>
            )}
            {user.gender && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Gender
                </label>
                <p className="text-base text-gray-900 dark:text-white">{user.gender}</p>
              </div>
            )}
            {user.dob && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date of Birth
                </label>
                <p className="text-base text-gray-900 dark:text-white">
                  {new Date(user.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            )}
            {user.domicile && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Domicile
                </label>
                <p className="text-base text-gray-900 dark:text-white">{user.domicile}</p>
              </div>
            )}
          </div>
          {user.address && (
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Address
              </label>
              <p className="text-base text-gray-900 dark:text-white">{user.address}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'education',
      label: 'Education & Skills',
      icon: <GraduationCap className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          {user.education && Object.values(user.education).some(val => val) && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Education</h4>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 space-y-3">
                {user.education.college && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      College/University
                    </label>
                    <p className="text-base text-gray-900 dark:text-white">{user.education.college}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {user.education.degree && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Degree
                      </label>
                      <p className="text-base text-gray-900 dark:text-white">{user.education.degree}</p>
                    </div>
                  )}
                  {user.education.course && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Course
                      </label>
                      <p className="text-base text-gray-900 dark:text-white">{user.education.course}</p>
                    </div>
                  )}
                  {user.education.year && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Year
                      </label>
                      <p className="text-base text-gray-900 dark:text-white">{user.education.year}</p>
                    </div>
                  )}
                </div>
                {user.education.grade && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Grade
                    </label>
                    <p className="text-base text-gray-900 dark:text-white">{user.education.grade}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {user.skills && user.skills.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.projects && user.projects.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Projects</h4>
              <div className="space-y-2">
                {user.projects.map((project, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-900 dark:text-white">{project}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: <Briefcase className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          {user.experience && Object.values(user.experience).some(val => val) ? (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.experience.domain && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Domain
                    </label>
                    <p className="text-base text-gray-900 dark:text-white font-medium">
                      {user.experience.domain}
                    </p>
                  </div>
                )}
                {user.experience.subDomain && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Sub-Domain
                    </label>
                    <p className="text-base text-gray-900 dark:text-white font-medium">
                      {user.experience.subDomain}
                    </p>
                  </div>
                )}
                {user.experience.years && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Years of Experience
                    </label>
                    <p className="text-base text-gray-900 dark:text-white font-medium">
                      {user.experience.years}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No experience information available</p>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-16 left-8">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=random`}
              alt={user.name}
              className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-800 object-cover shadow-xl"
            />
          </div>
        </div>

        <div className="pt-20 px-8 pb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-20rem)]">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>
        </div>
      </div>
    </div>
  );
}
