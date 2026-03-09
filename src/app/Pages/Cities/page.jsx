"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/page.jsx";
import Header from "../../Components/Header/page.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { MapPin, Trash2, Plus, Search } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";

const API = "http://143.110.244.163:5000/api/location";

const Page = () => {

  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])

  const [stateName, setStateName] = useState("")
  const [cityName, setCityName] = useState("")

  const [selectedState, setSelectedState] = useState(null)

  const [stateSearch, setStateSearch] = useState("")
  const [citySearch, setCitySearch] = useState("")


  /* ================= FETCH STATES ================= */

  const fetchStates = async () => {

    const res = await axios.get(`${API}/states`)

    setStates(res.data)

  }

  useEffect(() => {

    fetchStates()

  }, [])



  /* ================= FETCH CITIES ================= */

  const fetchCities = async (state) => {

    const res = await axios.get(`${API}/cities/${state}`)

    setCities(res.data.cities)

  }



  /* ================= ADD STATE ================= */

  const addState = async () => {

    if (!stateName) return toast.error("State name required")

    await axios.post(`${API}/add`, {
      state: stateName,
      cities: []
    })

    toast.success("State added")

    setStateName("")

    fetchStates()

  }



  /* ================= DELETE STATE ================= */

  const deleteState = async (id) => {

    if (!confirm("Delete this state?")) return

    await axios.delete(`${API}/state/${id}`)

    toast.success("State deleted")

    fetchStates()

    setSelectedState(null)

    setCities([])

  }



  /* ================= ADD CITY ================= */

  const addCity = async () => {

    if (!selectedState) return toast.error("Select state first")

    if (!cityName) return toast.error("City name required")

    await axios.post(`${API}/city/${selectedState._id}`, {
      city: cityName
    })

    toast.success("City added")

    setCityName("")

    fetchCities(selectedState.state)

  }



  /* ================= DELETE CITY ================= */

  const deleteCity = async (city) => {

    if (!confirm("Delete city?")) return

    await axios.delete(`${API}/city/${selectedState._id}`, {
      data: { city }
    })

    toast.success("City deleted")

    fetchCities(selectedState.state)

  }



  /* ================= FILTER STATES ================= */

  const filteredStates = states.filter(s =>
    s.state.toLowerCase().includes(stateSearch.toLowerCase())
  )



  /* ================= FILTER CITIES ================= */

  const filteredCities = cities.filter(c =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  )



  return (

    <div className="flex h-screen bg-[#F6FAFF]">

      {/* SIDEBAR */}

      <div className="hidden lg:block h-screen">
        <Sidebar />
      </div>


      <div className="flex-1 flex flex-col">

        <Header />


        <div className="flex-1 overflow-y-auto p-6 space-y-6">


          {/* PAGE HEADER */}

          <div className="flex justify-between items-center">

            <h1 className="text-2xl font-semibold flex items-center gap-2">

              <MapPin size={22} />
              Location Management

            </h1>

          </div>



          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


            {/* ================= STATES ================= */}

            <div className="bg-white rounded-xl shadow p-6">

              <div className="flex justify-between items-center mb-4">

                <h2 className="font-semibold">
                  States
                </h2>

                <span className="text-sm text-gray-500">
                  {states.length} total
                </span>

              </div>



              {/* ADD STATE */}

              <div className="flex gap-3 mb-4">

                <input
                  placeholder="Add new state"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full"
                />

                <button
                  onClick={addState}
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                >

                  <Plus size={16} />
                  Add

                </button>

              </div>



              {/* SEARCH */}

              <div className="relative mb-4">

                <Search size={16} className="absolute left-3 top-3 text-gray-400" />

                <input
                  placeholder="Search states..."
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  className="border pl-9 pr-3 py-2 rounded-lg w-full"
                />

              </div>



              {/* STATE LIST */}

              <div className="space-y-2 max-h-[420px] overflow-auto">

                {filteredStates.map(state => (

                  <div
                    key={state._id}
                    onClick={() => {

                      setSelectedState(state)

                      fetchCities(state.state)

                    }}

                    className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition
${selectedState?._id === state._id ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"}`}
                  >

                    <span className="font-medium">
                      {state.state}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteState(state._id)
                      }}
                      className="text-red-500 hover:text-red-700"
                    >

                      <Trash2 size={16} />

                    </button>

                  </div>

                ))}

              </div>

            </div>



            {/* ================= CITIES ================= */}

            <div className="bg-white rounded-xl shadow p-6">

              <h2 className="font-semibold mb-4">

                {selectedState
                  ? `Cities in ${selectedState.state}`
                  : "Select state to manage cities"}

              </h2>


              {selectedState && (

                <>


                  {/* ADD CITY */}

                  <div className="flex gap-3 mb-4">

                    <input
                      placeholder="Add new city"
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      className="border px-3 py-2 rounded-lg w-full"
                    />

                    <button
                      onClick={addCity}
                      className="bg-rose-500 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                    >

                      <Plus size={16} />
                      Add

                    </button>

                  </div>



                  {/* SEARCH */}

                  <div className="relative mb-4">

                    <Search size={16} className="absolute left-3 top-3 text-gray-400" />

                    <input
                      placeholder="Search cities..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="border pl-9 pr-3 py-2 rounded-lg w-full"
                    />

                  </div>



                  {/* CITY LIST */}

                  <div className="space-y-2 max-h-[420px] overflow-auto">

                    {filteredCities.map((city, index) => (

                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
                      >

                        <span>
                          {city}
                        </span>

                        <button
                          onClick={() => deleteCity(city)}
                          className="text-red-500 hover:text-red-700"
                        >

                          <Trash2 size={16} />

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

  )

}

export default ProtectedRoute(Page)