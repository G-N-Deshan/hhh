import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { dataService } from "../services/dataService";
import Loader from "../components/Loader";
import { FaPlusCircle, FaEdit } from "react-icons/fa";

const CATEGORIES = ["Internship", "Research", "Workshop", "Scholarship", "Project"];
const DEPARTMENTS = [
  "Department of Information & Communication Technology",
  "Department of Engineering Technology",
  "Department of Biosystems Technology",
  "All Departments",
];

export default function OpportunityForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "Internship",
      department: "Department of Information & Communication Technology",
      location: "Faculty Campus / Hybrid",
      status: "Open",
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchOpportunity = async () => {
        try {
          const data = await dataService.getOpportunityById(id);
          setValue("title", data.title);
          setValue("description", data.description);
          setValue("category", data.category);
          setValue("department", data.department);
          setValue("location", data.location);
          setValue("contactEmail", data.contactEmail);
          setValue("applicationUrl", data.applicationUrl || "");
          setValue("status", data.status);
          if (data.deadline) {
            setValue("deadline", new Date(data.deadline).toISOString().split("T")[0]);
          }
          if (data.requirements) {
            setValue("requirements", Array.isArray(data.requirements) ? data.requirements.join(", ") : data.requirements);
          }
          if (data.tags) {
            setValue("tags", Array.isArray(data.tags) ? data.tags.join(", ") : data.tags);
          }
        } catch (err) {
          toast.error("Failed to load opportunity data");
          navigate("/opportunities");
        } finally {
          setLoading(false);
        }
      };
      fetchOpportunity();
    }
  }, [id, isEditMode, setValue, navigate]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (isEditMode) {
        await dataService.updateOpportunity(id, formData);
        toast.success("Opportunity updated successfully!");
        navigate(`/opportunities/${id}`);
      } else {
        const data = await dataService.createOpportunity(formData);
        toast.success("Opportunity published successfully!");
        navigate(`/opportunities/${data._id}`);
      }
    } catch (err) {
      toast.error("Failed to save opportunity");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading form details..." />;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Title Banner */}
        <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center text-xl">
            {isEditMode ? <FaEdit /> : <FaPlusCircle />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-outfit">
              {isEditMode ? "Edit Opportunity Listing" : "Post New Faculty Opportunity"}
            </h1>
            <p className="text-xs text-slate-400">
              {isEditMode
                ? "Update opportunity terms, deadlines, and requirements"
                : "Publish an internship, research project, scholarship, or tech workshop"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Opportunity Title *
            </label>
            <input
              type="text"
              placeholder="e.g. AI & Robotics Research Internship 2026"
              {...register("title", { required: "Title is required" })}
              className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none text-sm"
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title.message}</p>}
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Category *
              </label>
              <select
                {...register("category", { required: true })}
                className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Department *
              </label>
              <select
                {...register("department", { required: true })}
                className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none text-sm"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Detailed Description *
            </label>
            <textarea
              rows={5}
              placeholder="Describe the opportunity responsibilities, project scope, and learning outcomes..."
              {...register("description", { required: "Description is required" })}
              className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none text-sm"
            ></textarea>
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Deadline & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Application Deadline *
              </label>
              <input
                type="date"
                {...register("deadline", { required: "Deadline is required" })}
                className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none text-sm"
              />
              {errors.deadline && <p className="text-xs text-rose-400 mt-1">{errors.deadline.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Location / Mode
              </label>
              <input
                type="text"
                placeholder="e.g. Kamburupitiya Campus / Remote"
                {...register("location")}
                className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Contact Email & Application URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Contact Email *
              </label>
              <input
                type="email"
                placeholder="coordinator@fot.ruh.ac.lk"
                {...register("contactEmail", { required: "Contact email is required" })}
                className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none text-sm"
              />
              {errors.contactEmail && (
                <p className="text-xs text-rose-400 mt-1">{errors.contactEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                External Application Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://fot.ruh.ac.lk/apply"
                {...register("applicationUrl")}
                className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Requirements (Comma-separated) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Requirements (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. 3rd year student, Python experience, Good GPA"
              {...register("requirements")}
              className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none text-sm"
            />
          </div>

          {/* Tags (Comma-separated) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Keywords & Tags (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. AI, Python, Embedded, Grant"
              {...register("tags")}
              className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none text-sm"
            />
          </div>

          {/* Status (If Edit Mode) */}
          {isEditMode && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Listing Status
              </label>
              <select
                {...register("status")}
                className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none text-sm"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-3 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-semibold text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all font-outfit"
            >
              {submitting ? "Saving..." : isEditMode ? "Update Opportunity" : "Publish Opportunity"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
