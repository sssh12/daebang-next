"use client";

import { useState, useEffect } from "react";

import {
  Undo2,
  Heart,
  Share2,
  MapPin,
  Building,
  Square,
  Layers,
  CalendarDays,
  ParkingCircle,
  ArrowBigUpDash,
  Dog,
  Cat,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import InquiryModal from "./InquiryModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const sqmToPyeong = (sqm) => {
  if (!sqm || isNaN(Number(sqm))) return "";
  return (Number(sqm) / 3.305785).toFixed(1);
};

export default function PropertyDetail({ property, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState(property?.address || "주소 정보 없음");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  useEffect(() => {
    if (
      !property?.address &&
      property?.lat &&
      property?.lng &&
      window.kakao &&
      window.kakao.maps &&
      window.kakao.maps.services
    ) {
      setIsLoadingAddress(true);
      const geocoder = new window.kakao.maps.services.Geocoder();
      const coord = new window.kakao.maps.LatLng(
        Number(property.lat),
        Number(property.lng)
      );

      const callback = function (result, status) {
        if (status === window.kakao.maps.services.Status.OK) {
          const roadAddress = result[0].road_address
            ? result[0].road_address.address_name
            : null;
          const jibunAddress = result[0].address
            ? result[0].address.address_name
            : null;
          setAddress(roadAddress || jibunAddress || "주소 변환 실패");
        } else {
          setAddress("주소 변환 실패");
          console.error("Geocoder failed due to: " + status);
        }
        setIsLoadingAddress(false);
      };

      geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    } else if (property?.address) {
      setAddress(property.address);
      setIsLoadingAddress(false);
    } else {
      setAddress("주소 정보 없음");
      setIsLoadingAddress(false);
    }
  }, [property]);

  if (!property) return null;

  const images = property.images?.length ? property.images : [];
  const pyeong = sqmToPyeong(property.room_size);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const formatMaintenanceFee = (fee) => {
    if (fee === null || fee === undefined || fee === "") return "없음";
    const numFee = Number(fee);
    if (isNaN(numFee)) return "정보 없음";
    if (numFee === 0) return "없음";
    return `${numFee.toLocaleString()}원`;
  };

  const formatMoveInDate = (dateStr) => {
    if (!dateStr) return "정보 없음";
    if (dateStr === "즉시 입주") return "즉시 입주 가능";
    if (dateStr === "협의 가능") return "입주 협의";
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return `${format(
          new Date(dateStr + "T00:00:00"),
          "yyyy년 M월 d일 이후",
          { locale: ko }
        )}`;
      }
    } catch (e) {}
    return dateStr;
  };

  const keyInfoItems = [
    {
      icon: Square,
      label: "크기",
      value: pyeong ? `${pyeong}평 (${property.room_size}㎡)` : "정보 없음",
    },
    {
      icon: Layers,
      label: "층수",
      value: property.floor ? `${property.floor}층` : "정보 없음",
    },
    {
      icon: Building,
      label: "준공",
      value: property.year_built ? `${property.year_built}년` : "정보 없음",
    },
    {
      icon: CalendarDays,
      label: "입주",
      value: formatMoveInDate(property.moveInDate),
    },
    {
      icon: ParkingCircle,
      label: "주차",
      value: property.hasParking ? "가능" : "불가",
    },
    {
      icon: ArrowBigUpDash,
      label: "엘리베이터",
      value: property.hasElevator ? "있음" : "없음",
    },
    {
      icon: property.petAllowed ? Cat : Dog,
      label: "반려동물",
      value: property.petAllowed ? "가능" : "불가",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white flex items-center text-xl p-3 font-bold relative">
        <Undo2
          className="w-10 h-10 cursor-pointer rounded p-2 hover:bg-gray-200 transition"
          onClick={onClose}
        />
        <div className="absolute left-0 right-0 flex justify-center items-center pointer-events-none">
          <span>매물 {property.id}</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center">
          <Heart className="w-10 h-10 cursor-pointer rounded p-2 hover:bg-gray-200 transition" />
          <Share2 className="w-10 h-10 cursor-pointer rounded p-2 hover:bg-gray-200 transition" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="relative w-full h-80 bg-gray-200">
          {images.length > 0 ? (
            <>
              <Image
                src={images[imgIdx]}
                alt={`매물 이미지 ${imgIdx + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
                priority={imgIdx === 0}
              />
              {images.length > 1 && (
                <>
                  <button
                    className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition focus:outline-none"
                    onClick={() =>
                      setImgIdx((i) => (i === 0 ? images.length - 1 : i - 1))
                    }
                    aria-label="이전 이미지"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition focus:outline-none"
                    onClick={() =>
                      setImgIdx((i) => (i === images.length - 1 ? 0 : i + 1))
                    }
                    aria-label="다음 이미지"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                    {imgIdx + 1} / {images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              이미지 없음
            </div>
          )}
        </div>
        <div className="p-4 bg-white">
          <div className="mb-4">
            <span className="text-sm p-0.5 border border-gray-200 bg-gray-100 text-gray-700 inline-block mb-2">
              매물 {property.id}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {property.price_type} {property.price?.toLocaleString()}
              {property.deposit
                ? ` / ${property.deposit.toLocaleString()}`
                : ""}
            </h1>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-gray-400" />{" "}
              {isLoadingAddress ? "주소 로딩 중..." : address}
            </p>
          </div>
          <div className="border-t pt-4">
            <p className="text-md">{property.title}</p>
            <p className="text-sm text-gray-600 mt-1">
              관리비: {formatMaintenanceFee(property.maintenance_fee)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-px bg-gray-200 mt-2 border-y border-gray-200">
          {keyInfoItems.map((item, index) => (
            <div key={index} className="bg-white p-3 text-center">
              <item.icon
                className="w-5 h-5 mx-auto text-green-600 mb-1"
                strokeWidth={1.5}
              />
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-medium text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-2 bg-white">
          <Accordion
            type="multiple"
            defaultValue={["description", "options"]}
            className="w-full"
          >
            {property.description && (
              <AccordionItem value="description">
                <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline">
                  상세 설명
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-0 text-sm text-gray-700 whitespace-pre-line">
                  {property.description}
                </AccordionContent>
              </AccordionItem>
            )}

            {(property.roomOptions?.length > 0 ||
              property.securityOptions?.length > 0) && (
              <AccordionItem value="options">
                <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline">
                  옵션 정보
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-0 text-sm text-gray-700 space-y-3">
                  {property.roomOptions?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-gray-600">
                        방 옵션
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {property.roomOptions.map((opt) => (
                          <span
                            key={opt}
                            className="flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            <CheckCircle className="w-3 h-3 mr-1 text-green-600" />{" "}
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {property.securityOptions?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-gray-600">
                        보안 옵션
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {property.securityOptions.map((opt) => (
                          <span
                            key={opt}
                            className="flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            <CheckCircle className="w-3 h-3 mr-1 text-green-600" />{" "}
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </div>

      <div className="p-4 border-t flex gap-2">
        <button
          onClick={openModal}
          className="bg-green-600 text-white cursor-pointer hover:bg-green-900 active:scale-98 flex-1 py-2 rounded font-semibold transition"
        >
          문의하기
        </button>
      </div>

      {isModalOpen && <InquiryModal property={property} onClose={closeModal} />}
    </div>
  );
}

const ChevronLeft = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
const ChevronRight = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
