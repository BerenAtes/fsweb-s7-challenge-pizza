import React, { useEffect, useState } from "react";
import "./OrderForm.css";
import Product from "../Components/Product";
import * as yup from "yup";
import { productData } from "../Datas/ProductData";
import axios from "axios";

const OrderForm = (props) => {
  const { handleSubmit, handleOrder } = props;
  const initialData = {
    title: "",
    price: 0,
    dough: "",
    size: "",
    rate: "",
    comment: "",
    description: "",
    extraIngredient: [],
    orderNotes: "",
    totalPrice: 0,
    counter: 1,
  };

  const extraIngredients = [
    "Pepperoni",
    "Domates",
    "Biber",
    "Sosis",
    "Misir",
    "Sucuk",
    "Kanada Jambonu",
    "Kekik",
    "Ananas",
    "Tavuk Izgara",
    "Jalepano",
    "Kabak",
    "Sogan",
    "Sarimsak",
  ];

  const [formData, setFormData] = useState(initialData);
  const [isValid, setIsValid] = useState(false);
  const [extraIngredientPrice, setExtraIngredientPrice] = useState(0);
  const [errors, setErrors] = useState({ dough: "", extraIngredient: "" });

  const formSchema = yup.object().shape({
    dough: yup
      .string()
      .oneOf(
        ["Ince Hamur", "Orta Hamur", "Kalin Hamur"],
        "Bir pizza hamur kalınlığı seçmelisiniz."
      )
      .required("Lutfen hamur seciniz"),
    size: yup
      .string()
      .oneOf(["Kucuk", "Orta", "Buyuk"])
      .required("Pizza boyutunu seciniz"),
    extraIngredient: yup.array().max(10, "En fazla 10 malzeme secebilirsiniz."),
  });

  useEffect(() => {
    const newFormEntries = { ...formData };
    newFormEntries.extraIngredientPrice = extraIngredientPrice;
    newFormEntries.totalPrice =
      newFormEntries.counter * productData[0].price + extraIngredientPrice;
    setFormData(newFormEntries);
  }, [extraIngredientPrice, formData.counter]);

  useEffect(() => {
    formSchema.isValid(formData).then((valid) => setIsValid(valid));
  }, [formData]);

  const handleIncreasment = (event) => {
    event.preventDefault();
    setFormData((prevData) => ({ ...prevData, counter: prevData.counter + 1 }));
  };

  const handleDecreasment = (event) => {
    event.preventDefault();
    if (formData.counter > 1) {
      setFormData((prevData) => ({
        ...prevData,
        counter: prevData.counter - 1,
      }));
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    if (event.target.type === "checkbox") {
      if (value) {
        setFormData((prevData) => ({
          ...prevData,
          extraIngredient: [...prevData.extraIngredient, name],
        }));
        setExtraIngredientPrice((prevPrice) => prevPrice + 5);
        yup
          .reach(formSchema, "extraIngredient")
          .validate([...formData.extraIngredient, name])
          .then(() =>
            setErrors((prevErrors) => ({ ...prevErrors, extraIngredient: "" }))
          )
          .catch((err) =>
            setErrors((prevErrors) => ({
              ...prevErrors,
              extraIngredient: err.errors[0],
            }))
          );
      } else {
        setFormData((prevData) => ({
          ...prevData,
          extraIngredient: prevData.extraIngredient.filter(
            (item) => item !== name
          ),
        }));
        setExtraIngredientPrice((prevPrice) => prevPrice - 5);
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handlerSubmit = (event) => {
    event.preventDefault();

    if (!isValid) return;

    handleSubmit(formData);
    axios
      .post("https://reqres.in/api/users", formData)
      .then((res) => {
        handleOrder(res.data);
      })
      .catch((err) => {
        console.error(err.response.message);
      });
  };

  return (
    <div className="main-container">
      <div className="first-section">
        <Product />
      </div>
      <form onSubmit={handlerSubmit}>
        <div className="order-form">
          <div className="form-container">
            <div className="product-size span-color">
              <div className="boyut-sec">
                {" "}
                <label htmlFor="boyut-sec">
                  Boyut Seç<span>*</span>
                </label>
              </div>

              <div className="small">
                <input
                  type="radio"
                  name="size"
                  id="size-small"
                  value="Kucuk"
                  checked={formData.size === "Kucuk"}
                  onChange={handleChange}
                  data-cy="size-select"
                />
                <label htmlFor="size-small" className="size-margin">
                  Küçük
                </label>
              </div>
              <div className="medium">
                <input
                  type="radio"
                  name="size"
                  id="size-medium"
                  value="Orta"
                  checked={formData.size === "Orta"}
                  onChange={handleChange}
                />
                <label htmlFor="size-medium" className="size-margin">
                  Orta
                </label>
              </div>
              <div className="large">
                <input
                  type="radio"
                  name="size"
                  id="size-large"
                  value="Buyuk"
                  checked={formData.size === "Buyuk"}
                  onChange={handleChange}
                />
                <label htmlFor="size-large" className="size-margin">
                  Büyük
                </label>
              </div>
              {errors.size && <p className="error-message">{errors.size}</p>}
            </div>
            <div className="dough-size span-color">
              <h3>
                Hamur Sec <span>*</span>
              </h3>
              <select
                name="dough"
                id="dough"
                value={formData.dough}
                onChange={handleChange}
              >
                <option value="kalinlik" data-cy="hamur-secim">
                  Hamur Kalinligi
                </option>
                <option value="Ince Hamur">Ince Hamur</option>
                <input type="radio" value="ince" />
                <option value="Orta Hamur">Orta Hamur</option>
                <input type="radio" value="orta" />
                <option value="Kalin Hamur">Kalin Hamur</option>
                <input type="radio" value="kalın" />
              </select>
              {errors.dough && <p className="error-message">{errors.dough}</p>}
            </div>
          </div>
        </div>
        <div className="ek-malzemeler">
          <h3>Ek Malzemeler</h3>
          <span className="malzeme-sayi">
            En Fazla 10 malzeme secebilirsiniz. 5₺
          </span>
          <div className="malzeme-wrapper" data-cy="malzeme-secim">
            {extraIngredients.map((malz, i) => (
              <div className="malzeme">
                <input
                  id={`ingredient-${i}`}
                  type="checkbox"
                  name={malz}
                  checked={formData.extraIngredient.includes(malz)}
                  onChange={handleChange}
                  key={i}
                />
                <label className="size-margin" htmlFor={`ingredient-${i}`}>
                  {malz}
                </label>
              </div>
            ))}
          </div>
          {errors.extraIngredient && (
            <p className="error-message">{errors.extraIngredient}</p>
          )}
        </div>
        <div className="order-notes">
          <label htmlFor="order-notes" id="siparis-notu">
            <h3>Siparis Notu</h3>
          </label>

          <input
            className="text-input"
            type="text"
            name="orderNotes"
            id="order-notes"
            value={formData.orderNotes}
            placeholder="Siparisine eklemek istedigin bir not var mi?"
            onChange={handleChange}
            data-cy="siparis-notu"
          />
        </div>
        <hr style={{ width: "50%" }} />
        <div className="inflex-container">
          <div className="inflex ">
            <button className="dec" onClick={handleDecreasment}>
              -
            </button>
            <div className="counter-but">{formData.counter}</div>
            <button className="inc" onClick={handleIncreasment}>
              +
            </button>
          </div>
          <div className="siparis-box">
            <div className="siparis-container">
              <div className="siparis">
                {" "}
                <h3>Siparis Toplami</h3>
                <div className="secim">
                  <p className="secimler">Secimler</p>
                  <p className="ekstra-secim">{extraIngredientPrice}₺</p>
                </div>
                <div className="total-cont">
                  <p className="toplam">
                    <span>Toplam</span>
                  </p>
                  <p>
                    <span>{formData.totalPrice}₺</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="submit-button">
              <button
                className="order-button"
                type="submit"
                disabled={!isValid}
              >
                Siparis Ver
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
