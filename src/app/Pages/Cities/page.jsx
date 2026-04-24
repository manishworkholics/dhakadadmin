"use client";

import React, { useState, useEffect } from "react";
import AdminShell from "@/components/layout/AdminShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";


import axios from "axios";
import { toast } from "react-toastify";
import { MapPin, Trash2, Plus, Search } from "lucide-react";
import ProtectedRoute from "../Common_Method/protectedroute.js";

const API = "https://dhakadmatrimony.com/api/location";

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
  <AdminShell>

    <Card className="p-4 md:p-6">

      <PageHeader
        title="Location Management"
        subtitle="Manage states and cities"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* ================= STATES ================= */}
        <Card className="p-5">

          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">States</h2>
            <span className="text-sm text-muted-foreground">
              {states.length} total
            </span>
          </div>

          {/* ADD STATE */}
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Add new state"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            />

            <Button onClick={addState} className="flex gap-1">
              <Plus size={16} />
              Add
            </Button>
          </div>

          {/* SEARCH */}
          <Input
            placeholder="Search states..."
            value={stateSearch}
            onChange={(e) => setStateSearch(e.target.value)}
            className="mb-4"
          />

          {/* LIST */}
          <div className="space-y-2 max-h-[420px] overflow-auto">

            {filteredStates.map((state) => (

              <div
                key={state._id}
                onClick={() => {
                  setSelectedState(state);
                  fetchCities(state.state);
                }}
                className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition
                ${
                  selectedState?._id === state._id
                    ? "bg-primary/10 border-primary"
                    : "hover:bg-muted"
                }`}
              >

                <span className="font-medium">{state.state}</span>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteState(state._id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>

              </div>

            ))}

          </div>

        </Card>

        {/* ================= CITIES ================= */}
        <Card className="p-5">

          <h2 className="font-semibold mb-4">

            {selectedState
              ? `Cities in ${selectedState.state}`
              : "Select state to manage cities"}

          </h2>

          {selectedState && (
            <>

              {/* ADD CITY */}
              <div className="flex gap-3 mb-4">

                <Input
                  placeholder="Add new city"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                />

                <Button
                  onClick={addCity}
                  variant="primary"
                  className="flex gap-1"
                >
                  <Plus size={16} />
                  Add
                </Button>

              </div>

              {/* SEARCH */}
              <Input
                placeholder="Search cities..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="mb-4"
              />

              {/* LIST */}
              <div className="space-y-2 max-h-[420px] overflow-auto">

                {filteredCities.map((city, index) => (

                  <div
                    key={index}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted"
                  >

                    <span>{city}</span>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteCity(city)}
                    >
                      <Trash2 size={14} />
                    </Button>

                  </div>

                ))}

              </div>

            </>
          )}

        </Card>

      </div>

    </Card>

  </AdminShell>
);
}

export default ProtectedRoute(Page)