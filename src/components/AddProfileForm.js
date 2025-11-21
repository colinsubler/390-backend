"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./AddProfileForm.module.css";

const stripTags = (s) => String(s ?? "").replace(/<\/?[^>]+>/g, "");
const trimCollapse = (s) =>
  String(s ?? "")
    .trim()
    .replace(/\s+/g, " ");

const AddProfileForm = ({ initialData = {} }) => {
  const router = useRouter();
  const nameRef = useRef(null);
  const isEditMode = !!initialData.id;
  const [values, setValues] = useState({
    name: initialData.name || "",
    title: initialData.title || "",
    email: initialData.email || "",
    bio: initialData.bio || "",
    img: null,
    existingImageUrl: initialData.image_url || "", // Store original image URL
  });
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { name, title, email, bio, img, existingImageUrl } = values;

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img") {
      const file = files[0];
      if (file && file.size < 1024 * 1024) {
        // 1MB limit
        setValues((prev) => ({ ...prev, img: file }));
      } else {
        setErrors("Image size should be less than 1MB");
      }
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
      setErrors("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors("");

    try {
      const formData = new FormData();
      formData.append("name", stripTags(trimCollapse(name)));
      formData.append("title", stripTags(trimCollapse(title)));
      formData.append("email", stripTags(trimCollapse(email)));
      formData.append("bio", stripTags(bio).trim());
      
      // If new image uploaded, use it; otherwise keep existing
      if (img) {
        formData.append("img", img);
      } else if (isEditMode && existingImageUrl) {
        formData.append("image_url", existingImageUrl);
      }
      
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode ? `/api/profiles/${initialData.id}` : "/api/profiles";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      setSuccess(isEditMode ? "Profile updated successfully!" : "Profile added successfully!");
      if (!isEditMode) {
        setValues({
          name: "",
          title: "",
          email: "",
          bio: "",
          img: null,
          existingImageUrl: "",
        });
      }

      // Reset file input
      const fileInput = document.getElementById("img");
      if (fileInput) fileInput.value = "";

      setTimeout(() => {
        setSuccess("");
        router.push("/");
      }, 2000);
    } catch (error) {
      setErrors(error.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
      <div className={styles.addProfile}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            ref={nameRef}
            type="text"
            name="name"
            id="name"
            required
            value={name}
            onChange={onChange}
          />
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={title}
            onChange={onChange}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={email}
            onChange={onChange}
          />
          <label htmlFor="bio">Bio:</label>
          <textarea
            name="bio"
            id="bio"
            placeholder="Add Bio..."
            required
            value={bio}
            onChange={onChange}
          ></textarea>
          <label htmlFor="img">Image:</label>
          <input
            type="file"
            name="img"
            id="img"
            required={!isEditMode}
            accept="image/png, image/jpeg, image/jpg, image/gif"
            onChange={onChange}
          />
          {isEditMode && existingImageUrl && !img && (
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Current image will be kept if no new image is uploaded
            </p>
          )}
          {errors && <p className={styles.errorMessage}>{errors}</p>}
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !stripTags(trimCollapse(name)) ||
              !stripTags(trimCollapse(title)) ||
              !stripTags(trimCollapse(email)) ||
              !stripTags(bio).trim() ||
              (!img && !isEditMode) // Only require image for new profiles
            }
          >
            {isEditMode ? "Update Profile" : "Add Profile"}
          </button>
          {success && <p className={styles.successMessage}>{success}</p>}
        </form>
      </div>
  );
}

export default AddProfileForm;