
import { useEffect, useRef, useState } from "react";
import "./App.css";

// Trip interests
const interests = [
  { name: "Food", icon: "🍜" },
  { name: "Culture", icon: "🏛️" },
  { name: "Nature", icon: "🌿" },
  { name: "Adventure", icon: "🥾" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Relaxation", icon: "☀️" },
];

// Featured destinations
const destinations = [
  {
    name: "Kyoto, Japan",
    tag: "Culture & calm",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&q=85",
  },
  {
    name: "Bali, Indonesia",
    tag: "Nature & escape",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&q=85",
  },
  {
    name: "Paris, France",
    tag: "Art & romance",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=85",
  },
];

const storageKey = "tripcraft-saved-trips";

const loadingMessages = [
  "Dreaming up experiences you'll love...",
  "Finding inspiration for your days...",
  "Getting your itinerary ready...",
  "A little travel magic takes time...",
];

// Load trips saved in this browser
function loadSavedTrips() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

// Starting details for a new activity
function newActivity() {
  return {
    id: crypto.randomUUID(),
    time: "10:00 AM",
    icon: "📍",
    title: "",
    description: "",
    category: "Adventure",
  };
}

// Loading screen inside the trip form
function TripLoading({ message, destination, onCancel }) {
  return (
    <section
      className="generating-panel"
      role="status"
      aria-live="polite"
      aria-label="Generating your itinerary"
    >
      <div className="generating-header">
        <div className="generating-orbit" aria-hidden="true">
          <span>✳</span>
        </div>

        <div className="generating-copy">
          <span className="eyebrow">
            YOUR ADVENTURE IS TAKING SHAPE
          </span>

          <h3>Something wonderful is on its way.</h3>

          <p className="loading-message">{message}</p>
        </div>
      </div>

      <div
        className="loading-preview"
        aria-hidden="true"
      >
        <div className="preview-card">
          <div className="preview-icon">🌿</div>
          <div className="preview-lines">
            <span className="skeleton-line short" />
            <span className="skeleton-line long" />
          </div>
        </div>

        <div className="preview-card">
          <div className="preview-icon">✦</div>
          <div className="preview-lines">
            <span className="skeleton-line medium" />
            <span className="skeleton-line long" />
          </div>
        </div>

        <div className="preview-card">
          <div className="preview-icon">☀️</div>
          <div className="preview-lines">
            <span className="skeleton-line short" />
            <span className="skeleton-line medium" />
          </div>
        </div>
      </div>

      <div className="generating-footer">
        <p>
          Planning your trip to <strong>{destination}</strong>.
          AI requests can take a little while.
        </p>

        <button
          type="button"
          className="cancel-generation"
          onClick={onCancel}
        >
          Cancel generation
        </button>
      </div>
    </section>
  );
}

// Popup for adding and editing activities
function ActivityModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.time.trim() ||
      !form.title.trim() ||
      !form.description.trim()
    ) {
      setError(
        "Please fill in the time, activity name, and description."
      );
      return;
    }

    onSave({
      ...form,
      time: form.time.trim(),
      icon: form.icon.trim() || "📍",
      title: form.title.trim(),
      description: form.description.trim(),
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="activity-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-modal-title"
      >
        <div className="modal-topline">
          <span className="eyebrow">
            ✦ MAKE IT YOURS
          </span>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close activity editor"
          >
            ×
          </button>
        </div>

        <h2 id="activity-modal-title">
          {initial.isNew
            ? "Add an activity"
            : "Edit your activity"}
        </h2>

        <p className="muted modal-intro">
          The best journeys leave room for your own ideas.
        </p>

        <form
          className="modal-form"
          onSubmit={handleSubmit}
        >
          <div className="modal-form-fields">
            <div className="modal-two-col">
              <label>
                Time
                <input
                  autoFocus
                  value={form.time}
                  onChange={(event) =>
                    updateField("time", event.target.value)
                  }
                  placeholder="9:00 AM"
                  maxLength={30}
                />
              </label>

              <label>
                Emoji
                <input
                  value={form.icon}
                  onChange={(event) =>
                    updateField("icon", event.target.value)
                  }
                  placeholder="📍"
                  maxLength={12}
                />
              </label>
            </div>

            <label>
              Activity name
              <input
                value={form.title}
                onChange={(event) =>
                  updateField("title", event.target.value)
                }
                placeholder="Visit a local market"
                maxLength={100}
              />
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
              >
                {interests.map((interest) => (
                  <option
                    key={interest.name}
                    value={interest.name}
                  >
                    {interest.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Description
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                placeholder="What makes this stop special?"
                rows={4}
                maxLength={500}
              />
            </label>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="button-outline"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button-primary"
            >
              Save activity ↗
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function App() {
  // Navigation and trip form
  const [page, setPage] = useState("explore");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState("Moderate");
  const [selectedInterests, setSelectedInterests] =
    useState([]);

  // Generated itinerary
  const [trip, setTrip] = useState(null);
  const [activeDay, setActiveDay] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [error, setError] = useState("");

  // Saved trips and activity editor
  const [savedTrips, setSavedTrips] =
    useState(loadSavedTrips);
  const [editor, setEditor] = useState(null);

  // Keeps track of requests so Cancel works
  const controllerRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify(savedTrips)
    );
  }, [savedTrips]);

  // Change the loading message every few seconds
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setLoadingIndex((previous) =>
        (previous + 1) % loadingMessages.length
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [isGenerating]);

  // Stop requests if the app closes
  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  function navigate(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleInterest(name) {
    setSelectedInterests((previous) =>
      previous.includes(name)
        ? previous.filter((item) => item !== name)
        : [...previous, name]
    );
  }

  function selectDestination(name) {
    setDestination(name);

    document
      .getElementById("trip-form")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }

  // Create an itinerary with Gemini through Express
  async function generateTrip(event) {
    event.preventDefault();

    if (isGenerating) return;

    if (!destination.trim()) {
      setError("Please enter a destination.");
      return;
    }

    if (selectedInterests.length === 0) {
      setError("Pick at least one interest.");
      return;
    }

    setError("");
    setIsGenerating(true);
    setLoadingIndex(0);

    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    controllerRef.current = controller;

    // Prevent requests from hanging forever
    const timeout = setTimeout(() => {
      controller.abort();
    }, 90000);

    try {
      const response = await fetch(
        "/api/generate-trip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destination: destination.trim(),
            duration: Number(duration),
            budget,
            interests: selectedInterests,
          }),
          signal: controller.signal,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Couldn't create your trip."
        );
      }

      if (!Array.isArray(data.trip?.days)) {
        throw new Error(
          "The server returned an invalid itinerary."
        );
      }

      // Ignore a response if the request was cancelled
      if (requestId !== requestIdRef.current) {
        return;
      }

      const newTrip = {
        ...data.trip,
        id: crypto.randomUUID(),
        source: data.source || "unknown",
        createdAt: new Date().toLocaleDateString(),
      };

      setTrip(newTrip);
      setActiveDay(1);
      navigate("itinerary");
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      if (err.name === "AbortError") {
        setError(
          "Generation took too long. Please try again."
        );
      } else if (err instanceof TypeError) {
        setError(
          "Can't connect to Express. Check that your backend is running."
        );
      } else {
        setError(
          err.message || "Couldn't create your trip."
        );
      }
    } finally {
      clearTimeout(timeout);

      if (requestId === requestIdRef.current) {
        controllerRef.current = null;
        setIsGenerating(false);
      }
    }
  }

  // Cancel the current generation
  function cancelGeneration() {
    requestIdRef.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    setIsGenerating(false);
    setError("");
  }

  const currentDay = trip?.days?.find(
    (day) => day.day === activeDay
  );

  // Update the activities on the selected day
  function updateActivities(activities) {
    setTrip((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        days: previous.days.map((day) =>
          day.day === activeDay
            ? { ...day, activities }
            : day
        ),
      };
    });
  }

  const isSaved = Boolean(
    trip &&
      savedTrips.some(
        (item) =>
          item.id === trip.id &&
          JSON.stringify(item.days) ===
            JSON.stringify(trip.days)
      )
  );

  // Save a trip in this browser
  function saveTrip() {
    if (!trip) return;

    setSavedTrips((previous) => [
      trip,
      ...previous.filter((item) => item.id !== trip.id),
    ]);
  }

  function openSavedTrip(savedTrip) {
    setTrip(savedTrip);
    setActiveDay(1);
    navigate("itinerary");
  }

  function deleteSavedTrip(id) {
    if (!window.confirm("Delete this saved trip?")) {
      return;
    }

    setSavedTrips((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }

  // Open the activity editor
  function openEditor(activity = null) {
    if (!currentDay) return;

    setEditor({
      ...newActivity(),
      ...activity,
      isNew: !activity,
    });
  }

  // Save edited or new activities
  function saveActivity(updated) {
    if (!currentDay) return;

    const { isNew, ...activity } = updated;

    if (isNew) {
      updateActivities([
        ...currentDay.activities,
        activity,
      ]);
    } else {
      updateActivities(
        currentDay.activities.map((item) =>
          item.id === activity.id ? activity : item
        )
      );
    }

    setEditor(null);
  }

  function removeActivity(id) {
    if (
      !window.confirm(
        "Remove this activity from your itinerary?"
      )
    ) {
      return;
    }

    updateActivities(
      currentDay.activities.filter(
        (activity) => activity.id !== id
      )
    );
  }

  function getSourceLabel() {
    if (trip?.source === "ai") {
      return {
        title: "AI-generated itinerary",
        description:
          "Personalized with Gemini. Places, opening hours, and availability have not been verified.",
      };
    }

    if (trip?.source === "demo") {
      return {
        title: "Demo itinerary",
        description:
          "Gemini was unavailable, so you're viewing sample activities.",
      };
    }

    return {
      title: "Your travel itinerary",
      description:
        "Review the suggested activities and customize them to suit your plans.",
    };
  }

  return (
    <div className="site-shell">
      {/* Navigation */}
      <header className="site-header">
        <button
          type="button"
          className="brand"
          onClick={() => navigate("explore")}
          aria-label="TripCraft home"
        >
          <span className="brand-star">✳</span>
          tripcraft<span className="brand-dot">.</span>
        </button>

        <nav
          className="nav-tabs"
          aria-label="Main navigation"
        >
          {[
            ["explore", "Explore"],
            ["itinerary", "My Itinerary"],
            ["saved", "Saved Trips"],
          ].map(([id, label]) => (
            <button
              type="button"
              key={id}
              className={
                page === id
                  ? "nav-tab active"
                  : "nav-tab"
              }
              onClick={() => navigate(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* Explore page */}
      {page === "explore" && (
        <main>
          <section className="hero">
            <div className="hero-image">
              <div className="hero-overlay">
                <span className="eyebrow light">
                  ✦ FOR THE CURIOUS HEART
                </span>

                <h1>
                  Go somewhere
                  <br />
                  <em>wonderful.</em>
                </h1>

                <p>
                  Your next favorite memory starts
                  with a little plan.
                </p>

                <a
                  className="hero-link"
                  href="#trip-form"
                >
                  Start your journey ↗
                </a>
              </div>
            </div>
          </section>

          {/* Trip planner */}
          <section
            className="section-container planning-section"
            id="trip-form"
          >
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  01 / YOUR JOURNEY
                </span>

                <h2>
                  Let's plan something beautiful.
                </h2>
              </div>

              <span className="handwritten">
                Just a few little details ↓
              </span>
            </div>

            <form
              className="planner-card"
              onSubmit={generateTrip}
            >
              <div className="planner-fields">
                <label className="field destination-field">
                  Where are we going?

                  <input
                    value={destination}
                    onChange={(event) =>
                      setDestination(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Kyoto, Japan"
                    maxLength={100}
                    disabled={isGenerating}
                  />
                </label>

                <label className="field">
                  How many days?

                  <select
                    value={duration}
                    onChange={(event) =>
                      setDuration(
                        Number(event.target.value)
                      )
                    }
                    disabled={isGenerating}
                  >
                    {Array.from(
                      { length: 14 },
                      (_, index) => (
                        <option
                          key={index + 1}
                          value={index + 1}
                        >
                          {index + 1}{" "}
                          {index === 0
                            ? "day"
                            : "days"}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className="field">
                  Travel style

                  <select
                    value={budget}
                    onChange={(event) =>
                      setBudget(event.target.value)
                    }
                    disabled={isGenerating}
                  >
                    <option>Budget-friendly</option>
                    <option>Moderate</option>
                    <option>Luxury</option>
                  </select>
                </label>
              </div>

              <div className="planner-divider" />

              <h3>
                What makes a trip special to you?
              </h3>

              <p className="muted">
                Pick as many as you like.
              </p>

              <div className="interest-list">
                {interests.map((interest) => (
                  <button
                    type="button"
                    key={interest.name}
                    disabled={isGenerating}
                    className={
                      selectedInterests.includes(
                        interest.name
                      )
                        ? "interest-chip selected"
                        : "interest-chip"
                    }
                    aria-pressed={selectedInterests.includes(
                      interest.name
                    )}
                    onClick={() =>
                      toggleInterest(interest.name)
                    }
                  >
                    <span>{interest.icon}</span>
                    {interest.name}
                  </button>
                ))}
              </div>

              {error && (
                <p
                  className="form-error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* Gemini loading animation */}
              {isGenerating && (
                <TripLoading
                  message={
                    loadingMessages[loadingIndex]
                  }
                  destination={destination}
                  onCancel={cancelGeneration}
                />
              )}

              <div className="planner-footer">
                <span className="planner-note">
                  ✦ Personalized plans, made
                  for your kind of adventure.
                </span>

                <button
                  type="submit"
                  className="button-primary generate-button"
                  disabled={isGenerating}
                >
                  {isGenerating
                    ? "Creating your trip..."
                    : "Create my trip ↗"}
                </button>
              </div>
            </form>
          </section>

          {/* Featured destinations */}
          <section className="section-container inspiration">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  02 / A LITTLE INSPIRATION
                </span>

                <h2>
                  Where will curiosity take you?
                </h2>
              </div>
            </div>

            <div className="destination-grid">
              {destinations.map((item) => (
                <button
                  type="button"
                  className="destination-card"
                  key={item.name}
                  onClick={() =>
                    selectDestination(item.name)
                  }
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                  />

                  <span className="destination-shade" />

                  <span className="destination-info">
                    <small>{item.tag}</small>
                    <strong>{item.name}</strong>
                    <span>
                      Explore this place ↗
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* My Itinerary page */}
      {page === "itinerary" && (
        <main className="section-container itinerary-page">
          {!trip ? (
            <section className="empty-state">
              <span className="eyebrow">
                YOUR JOURNEY AWAITS
              </span>

              <h1>No itinerary yet.</h1>

              <p>
                Let's create a trip you'll be
                excited about.
              </p>

              <button
                className="button-primary"
                onClick={() => navigate("explore")}
              >
                Plan a trip ↗
              </button>
            </section>
          ) : (
            <>
              <div className="trip-heading">
                <div>
                  <span className="eyebrow">
                    ✦ YOUR LITTLE CORNER OF THE WORLD
                  </span>

                  <h1>{trip.destination}</h1>

                  <p>
                    {trip.duration}{" "}
                    {trip.duration === 1
                      ? "day"
                      : "days"}
                    {" · "}
                    {trip.budget}
                    {" · "}
                    {trip.interests.join(" · ")}
                  </p>
                </div>

                <button
                  className={
                    isSaved
                      ? "button-outline saved-button"
                      : "button-outline"
                  }
                  onClick={saveTrip}
                >
                  {isSaved
                    ? "♥ Saved"
                    : "♡ Save trip"}
                </button>
              </div>

              <div className="source-notice">
                <span
                  className="notice-icon"
                  aria-hidden="true"
                >
                  ✦
                </span>

                <div>
                  <strong>
                    {getSourceLabel().title}
                  </strong>

                  <span>
                    {" — "}
                    {getSourceLabel().description}
                    {" "}
                    You can edit, add, and
                    remove activities.
                  </span>
                </div>
              </div>

              <div className="itinerary-layout">
                {/* Day selection */}
                <aside className="day-sidebar">
                  <h2>Your days</h2>

                  <p className="muted">
                    Choose a day to explore.
                  </p>

                  <div className="day-buttons">
                    {trip.days.map((day) => (
                      <button
                        key={day.day}
                        className={
                          activeDay === day.day
                            ? "day-button active"
                            : "day-button"
                        }
                        onClick={() =>
                          setActiveDay(day.day)
                        }
                        aria-pressed={
                          activeDay === day.day
                        }
                      >
                        Day {day.day}
                        <span>↗</span>
                      </button>
                    ))}
                  </div>
                </aside>

                {/* Activities */}
                <section
                  className="day-detail"
                  aria-live="polite"
                >
                  <span className="eyebrow">
                    DAY{" "}
                    {String(activeDay).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <div className="day-title-row">
                    <h2>
                      {currentDay?.title ||
                        `Day ${activeDay}`}
                    </h2>

                    <span
                      className="day-sun"
                      aria-hidden="true"
                    >
                      ☀️
                    </span>
                  </div>

                  <p className="muted day-subtitle">
                    Explore at your own pace.
                    Change any stop to make
                    this day yours.
                  </p>

                  <div className="activity-list">
                    {currentDay?.activities.map(
                      (activity) => (
                        <article
                          className="activity"
                          key={activity.id}
                        >
                          <div className="activity-icon">
                            {activity.icon}
                          </div>

                          <div className="activity-content">
                            <span className="activity-meta">
                              {activity.time}
                              {" · "}
                              {activity.category}
                            </span>

                            <h3>{activity.title}</h3>

                            <p>
                              {activity.description}
                            </p>

                            <div className="activity-actions">
                              <button
                                type="button"
                                className="mini-button"
                                onClick={() =>
                                  openEditor(activity)
                                }
                              >
                                ✎ Edit
                              </button>

                              <button
                                type="button"
                                className="mini-button remove"
                                onClick={() =>
                                  removeActivity(
                                    activity.id
                                  )
                                }
                              >
                                × Remove
                              </button>
                            </div>
                          </div>
                        </article>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    className="add-activity"
                    onClick={() => openEditor()}
                  >
                    ＋ Add an activity
                  </button>
                </section>
              </div>
            </>
          )}
        </main>
      )}

      {/* Saved trips */}
      {page === "saved" && (
        <main className="section-container saved-page">
          <span className="eyebrow">
            ✦ KEEP THE MEMORIES CLOSE
          </span>

          <h1>Saved trips</h1>

          <p className="muted">
            All your plans, ready whenever you are.
          </p>

          {savedTrips.length === 0 ? (
            <section className="empty-state">
              <h2>Nothing saved just yet.</h2>

              <p>
                Plan a journey and save it here
                for later.
              </p>

              <button
                className="button-primary"
                onClick={() => navigate("explore")}
              >
                Explore destinations ↗
              </button>
            </section>
          ) : (
            <div className="saved-grid">
              {savedTrips.map((saved) => (
                <article
                  className="saved-card"
                  key={saved.id}
                >
                  <span className="eyebrow">
                    YOUR SAVED JOURNEY
                  </span>

                  <h2>{saved.destination}</h2>

                  <p>
                    {saved.duration}{" "}
                    {saved.duration === 1
                      ? "day"
                      : "days"}
                    {" · "}
                    {saved.budget}
                  </p>

                  <p className="saved-interests">
                    {saved.interests.join(" · ")}
                  </p>

                  <span className="saved-date">
                    Trip created{" "}
                    {saved.createdAt || "recently"}
                  </span>

                  <div className="saved-actions">
                    <button
                      className="button-primary"
                      onClick={() =>
                        openSavedTrip(saved)
                      }
                    >
                      Open itinerary ↗
                    </button>

                    <button
                      className="button-outline"
                      onClick={() =>
                        deleteSavedTrip(saved.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="site-footer">
        <span>✳ tripcraft.</span>

        <span>
          Made for the places you haven't
          seen yet. ✦
        </span>
      </footer>

      {/* Activity editing popup */}
      {editor && (
        <ActivityModal
          initial={editor}
          onClose={() => setEditor(null)}
          onSave={saveActivity}
        />
      )}
    </div>
  );
}
