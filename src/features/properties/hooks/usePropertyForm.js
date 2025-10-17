import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function usePropertyForm() {
  const supabase = createClient();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price_type: "",
    price: "",
    deposit: "",
    room_type: "",
    lat: "",
    lng: "",
    images: [],
    year_built: "",
    distance_type: "",
    nearby_facilities: [],
    safety_options: [],
    living_options: [],
    pet_allowed: false,
    contract_period: "",
    maintenance_incl: [],
    loan_type: "",
    room_options: [],
    room_size: "",
    floor: "",
    maintenance_fee: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || null);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((v) => v !== value),
      }));
    } else if (type === "radio") {
      setForm({ ...form, [name]: value });
    } else if (type === "file") {
      setImageFiles(Array.from(e.target.files));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handlePetToggle = () => {
    setForm((prev) => ({ ...prev, pet_allowed: !prev.pet_allowed }));
  };

  const handleImageFiles = (files) => {
    setImageFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeImageFile = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrls = [];
    for (const file of imageFiles) {
      const filePath = `public/${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("property-images")
        .upload(filePath, file);
      if (!error) {
        const { data: urlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);
        imageUrls.push(urlData.publicUrl);
      } else {
        alert("이미지 업로드 실패: " + error.message);
        setLoading(false);
        return;
      }
    }

    const payload = {
      ...form,
      price: form.price ? Number(form.price) : null,
      deposit: form.deposit ? Number(form.deposit) : null,
      lat: form.lat ? Number(form.lat) : null,
      lng: form.lng ? Number(form.lng) : null,
      year_built: form.year_built ? Number(form.year_built) : null,
      room_size: form.room_size ? Number(form.room_size) : null,
      floor: form.floor ? Number(form.floor) : null,
      images: imageUrls,
      maintenance_fee: form.maintenance_fee
        ? Number(form.maintenance_fee)
        : null,
      user_id: userId,
    };

    const { error } = await supabase.from("properties").insert([payload]);
    setLoading(false);
    if (!error) {
      alert("매물이 등록되었습니다!");
      window.location.href = "/map";
    } else {
      alert("등록 실패: " + error.message);
    }
  };

  return {
    form,
    setForm,
    imageFiles,
    loading,
    handleChange,
    handlePetToggle,
    handleImageFiles,
    removeImageFile,
    handleSubmit,
  };
}
