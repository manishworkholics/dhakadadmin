"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Components/Sidebar/page.jsx";
import Header from "../../Components/Header/page.jsx";
import ProtectedRoute from "../Common_Method/protectedroute.js";
import { handleApiError } from "@/utils/apiErrorHandler.js";
import { toast } from "react-toastify";
import api from "@/services/api.js";
import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";

import RichTextEditor from "@webbycrown/react-advanced-richtext-editor";

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const editorValue = useMemo(() => content || "", [content]);

  const loadTerms = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/terms");
      const data = res.data?.terms || res.data?.data || res.data || {};
      setTitle(data.title || "");
      setContent(data.content || "");
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerms();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post("/api/terms/upsert", { title, content });
      toast.success("Terms saved");
      loadTerms();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 
        transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar collapsed={false} setCollapsed={() => {}} />
      </div>

      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <div className="flex-1 flex flex-col h-screen">
        <Header />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Terms &amp; Conditions</h1>
              <Button onClick={handleSave} disabled={saving || loading}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>

            <Card className="p-6">
              {loading ? (
                <div className="text-gray-500">Loading terms...</div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Title
                    </label>
                    <div className="mt-2">
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Terms title"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Content
                    </label>
                    <div className="mt-2">
                      <div className="border rounded-lg overflow-hidden">
                        <RichTextEditor
                          value={editorValue}
                          onChange={setContent}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Content is saved as HTML.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(Page);

