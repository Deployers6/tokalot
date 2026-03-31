import { CalendarIcon } from "lucide-react";
import React from "react";

export default function CreateSession() {
  return (
    <div className="bg-[#E0F8FF] rounded-2xl p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-[#C2E8FF] p-2 rounded-xl">
          <CalendarIcon className="h-5 w-5 text-[#006688]" />
        </div>
        <h2 className="font-extrabold text-lg">Create New Session</h2>
      </div>

      {/* Session Name */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">
          SESSION NAME
        </label>
        <input
          className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
          placeholder="e.g. TOEFL Speaking Practice"
        />
      </div>

      {/* Session Date */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">
          SESSION DATE
        </label>
        <input
          type="date"
          className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
        />
      </div>

      {/* Start Time + Seats */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-extrabold tracking-widest text-gray-500">
            START TIME
          </label>
          <input
            type="time"
            className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-extrabold tracking-widest text-gray-500">
            SEATS
          </label>
          <input
            type="number"
            defaultValue={15}
            className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
          />
        </div>
      </div>

      {/* Teacher */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">
          TEACHER
        </label>
        <select className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm text-gray-500">
          <option value="">Select a Teacher</option>
          <option value="teacher1">Teacher 1</option>
          <option value="teacher2">Teacher 2</option>
        </select>
      </div>

      {/* Submit */}
      <button className="bg-[#20BEF9] text-white font-extrabold tracking-widest py-4 rounded-xl mt-2">
        PUBLISH SESSION
      </button>
    </div>
  );
}
