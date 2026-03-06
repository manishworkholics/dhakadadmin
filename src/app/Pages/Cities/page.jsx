"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/page.jsx";
import Header from "../../Components/Header/page.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/apiErrorHandler.js";
import ProtectedRoute from "../Common_Method/protectedroute.js";

const API = "http://localhost:5000/api/location";

const Page = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");

  const [selectedState, setSelectedState] = useState(null);

  // ================= GET STATES =================

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${API}/states`);
      setStates(res.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  // ================= GET CITIES =================

  const fetchCities = async (state) => {
    try {
      const res = await axios.get(`${API}/cities/${state}`);
      setCities(res.data.cities);
    } catch (error) {
      handleApiError(error);
    }
  };

  // ================= ADD STATE =================

  const addState = async () => {

    if (!stateName) return toast.error("State name required");

    try {
      await axios.post(`${API}/add`, {
        state: stateName,
        cities: []
      });

      toast.success("State added successfully");

      setStateName("");

      fetchStates();

    } catch (error) {
      handleApiError(error);
    }
  };

  // ================= DELETE STATE =================

  const deleteState = async (id) => {
    try {

      await axios.delete(`${API}/state/${id}`);

      toast.success("State deleted");

      fetchStates();

      setCities([]);

      setSelectedState(null);

    } catch (error) {
      handleApiError(error);
    }
  };

  // ================= ADD CITY =================

  const addCity = async () => {

    if (!selectedState) return toast.error("Select state first");

    if (!cityName) return toast.error("City name required");

    try {

      await axios.post(`${API}/city/${selectedState._id}`, {
        city: cityName
      });

      toast.success("City added");

      setCityName("");

      fetchCities(selectedState.state);

    } catch (error) {
      handleApiError(error);
    }
  };

  // ================= DELETE CITY =================

  const deleteCity = async (city) => {
    try {

      await axios.delete(`${API}/city/${selectedState._id}`, {
        data: { city }
      });

      toast.success("City deleted");

      fetchCities(selectedState.state);

    } catch (error) {
      handleApiError(error);
    }
  };

  return (

    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* ================= SIDEBAR ================= */}

      <div className="hidden lg:block h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* ================= MAIN AREA ================= */}

      <div className="flex-1 flex flex-col h-screen">

        <Header />

        {/* ================= CONTENT ================= */}

        <div className="flex-1 overflow-y-auto p-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ================= STATE PANEL ================= */}

            <div className="bg-white p-6 rounded shadow">

              <h2 className="text-lg font-semibold mb-4">
                State Management
              </h2>

              {/* Add State */}

              <div className="flex gap-3 mb-4">

                <input
                  type="text"
                  placeholder="Enter State Name"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="border p-2 rounded w-full"
                />

                <button
                  onClick={addState}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Add
                </button>

              </div>

              {/* State List */}

              <div className="space-y-2">

                {states.map((state) => (

                  <div
                    key={state._id}
                    className={`flex justify-between items-center border p-2 rounded cursor-pointer
                    ${selectedState?._id === state._id ? "bg-blue-100" : ""}`}
                    onClick={() => {
                      setSelectedState(state);
                      fetchCities(state.state);
                    }}
                  >

                    <span>{state.state}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteState(state._id);
                      }}
                      className="text-red-500"
                    >
                      Delete
                    </button>

                  </div>

                ))}

              </div>

            </div>

            {/* ================= CITY PANEL ================= */}

            <div className="bg-white p-6 rounded shadow">

              <h2 className="text-lg font-semibold mb-4">

                {selectedState
                  ? `Cities in ${selectedState.state}`
                  : "Select State to Manage Cities"}

              </h2>

              {selectedState && (

                <>
                  {/* Add City */}

                  <div className="flex gap-3 mb-4">

                    <input
                      type="text"
                      placeholder="Enter City"
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      className="border p-2 rounded w-full"
                    />

                    <button
                      onClick={addCity}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Add
                    </button>

                  </div>

                  {/* City List */}

                  <div className="space-y-2">

                    {cities.map((city, index) => (

                      <div
                        key={index}
                        className="flex justify-between border p-2 rounded"
                      >

                        <span>{city}</span>

                        <button
                          onClick={() => deleteCity(city)}
                          className="text-red-500"
                        >
                          Delete
                        </button>

                      </div>

                    ))}

                  </div>

                </>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProtectedRoute(Page);