import React, { useCallback, useEffect, useRef, useState } from 'react';

import { AuthContext } from "@/contexts/AuthContext";
import { Form } from "react-bootstrap";
import Image from "next/image";
import { IoMailSharp } from "react-icons/io5";
import { LoaderContext } from "@/contexts/LoaderContext";
import { MdOutlineModeEditOutline } from "react-icons/md";
import Select from 'react-select';
import axios from "axios";
import { useContext } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    firstname: string;
    lastname: string;
    email: string;
    phone1: string;
    phone2: string;
    address: string;
    city: string;
    country: string;
    timezone: string;
    firstaccess: number;
    lastlogin: number;
    description: string;
    timecreated: number;
    opentowork: number;
    linkedin: string | null;
    portfolio: string | null;
    imagealt: string;
}

interface Continent {
    code: string;
    latitude: string;
    longitude: string;
    name: string;
    nameEs: string;
    nameFr: string;
}

interface Country {
    code: string;
    continent: Continent;
    latitude: string;
    longitude: string;
    name: string;
    nameEs: string;
    nameFr: string;
    nameNative: string[];
    population: number;
}

interface ApiResponse {
    data: User;
}

interface ApiResponseCountry {
    data: {
        countries: Country[];
    };
}

export default function Formulario() {

    const [perfil, setPerfil] = useState<User>();
    const [countrys, setCountrys] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<{ value: string; label: string } | null>(null);
    const inputFileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const { user } = useContext(AuthContext);
    const { updateResponses } = useContext(LoaderContext);

    const getPaises = useCallback((search: string, profile: User) => {
        axios.get(`https://api.thecompaniesapi.com/v2/locations/countries?search=${search}`)
            .then((res: ApiResponseCountry) => {
                setCountrys(res.data.countries);
                const country = res.data.countries.find((c) => c.code == profile.country.toLocaleLowerCase());
                if (country) {
                    setSelectedCountry({ value: country.code, label: country.name });
                }
            });
    }, [])

    const getPerfil = useCallback(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
            headers: {
                "database": user.database,
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then((res: ApiResponse) => {
                setPerfil(res.data);
                getPaises(res.data.country, res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                updateResponses();
            });
    }, [user, updateResponses, getPaises]);

    useEffect(() => {
        if (user?.database && user?.id) {
            getPerfil();
        }
    }, [user, getPerfil]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (perfil) {
            const { name, value } = e.target;
            const opentowork = value == "0" ? 1 : 0;

            if (name) {
                setPerfil((prevPerfil) => {
                    if (!prevPerfil) return prevPerfil;
                    const updatedPerfil: User = { ...prevPerfil, [name]: name == "opentowork" ? opentowork : value };
                    return updatedPerfil;
                });
            }
        }
    };

    const handleCountryChange = (option: { value: string; label: string } | null) => {
        setSelectedCountry(option);
        if (perfil) {
            setPerfil((prevPerfil) => {
                if (!prevPerfil) return prevPerfil;
                const updatedPerfil: User = { ...prevPerfil, country: option?.value || "" };
                return updatedPerfil;
            });
        }
    };

    const handleCountryInputChange = (inputValue: string) => {
        getPaises(inputValue, perfil!);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
            userid: parseInt(user?.id),
            user_data: perfil
        }, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then(() => {
                router.push("/perfil")
            });
    };

    const handleAlterarFoto = () => {
        inputFileRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData();
        formData.append('imagem', e.target.files![0]);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData, {
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
        })
            .then(() => {
                getPerfil();
            });
    };

    function removeHtmlTags(text: string) {
        return text.replace(/<[^>]*>/g, '');
    }

    return (
        perfil
        &&
        <Form onSubmit={handleSubmit} className="rounded-3 bg-auxiliary1-project p-4 perfil-perfil position-relative my-5">
            <div className="row row-gap-4 align-items-center mt-3">
                <div className="col-xxl-5">
                    <div className="row">
                        <div className="col-md-4 col-12 d-flex flex-column align-items-center gap-2">
                            {
                                perfil?.imagealt
                                &&
                                <Image src={perfil?.imagealt || ""} width={160} height={160} alt="foto de perfil" style={{ borderRadius: '100%', border: "#93C01F 4px solid" }} />
                            }
                            <span className='text-white fs-12 fw-700 cursor-pointer' onClick={handleAlterarFoto}>Alterar Foto</span>
                            <input
                                type="file"
                                multiple={false}
                                ref={inputFileRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className="d-flex ps-xxl-5 col-md-8 col-12 pt-3 gap-3 flex-column align-items-md-start align-items-center">
                            <span className="text-auxiliary10-project fs-21 fw-700">{perfil.firstname} {perfil.lastname}</span>
                            <span className="text-auxiliary10-project">
                                <IoMailSharp size={24} color="#fff" className="me-2" />
                                {perfil.email}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-4 offset-xxl-3">
                    <button className="w-100 btn btn-primary fs-14 fw-700" type='submit'>
                        <MdOutlineModeEditOutline size={22} className="me-2" />
                        Salvar
                    </button>
                    <button className="w-100 fs-12 fw-700 cursor-default text-auxiliary10-project opacity-100 d-flex align-items-center gap-3 justify-content-center btn btn-outline-light mt-3">
                        Disponível para ofertas de emprego?
                        <Form.Switch
                            type="switch"
                            id="custom-switch"
                            className="mt-0 cursor-pointer"
                            name="opentowork"
                            value={perfil.opentowork}
                            onChange={handleChange}
                            checked={perfil.opentowork == 1}
                        />
                    </button>
                </div>
            </div>
            <div className="bg-auxiliary4-project p-3 mb-3 mt-4 rounded-3">
                <div className="row">
                    <Form.Group className="mb-3 col-12" controlId="firstname">
                        <Form.Label className="text-white fs-14">Descrição</Form.Label>
                        <Form.Control
                            type="text"
                            as="textarea"
                            name="description"
                            className="form-input-login"
                            value={removeHtmlTags(perfil?.description || "")}
                            onChange={handleChange}
                            placeholder="Descrição"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 col-lg-6" controlId="firstname">
                        <Form.Label className="text-white fs-14">Nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstname"
                            className="form-input-login"
                            value={perfil?.firstname || ""}
                            onChange={handleChange}
                            placeholder="Nome"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 col-lg-6" controlId="firstname">
                        <Form.Label className="text-white fs-14">Sobrenome</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastname"
                            className="form-input-login"
                            value={perfil?.lastname || ""}
                            onChange={handleChange}
                            placeholder="Sobrenome"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 col-lg-6" controlId="firstname">
                        <Form.Label className="text-white fs-14">Linkedin</Form.Label>
                        <Form.Control
                            type="text"
                            name="linkedin"
                            className="form-input-login"
                            value={perfil?.linkedin || ""}
                            onChange={handleChange}
                            placeholder="Linkedin"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 col-lg-6" controlId="firstname">
                        <Form.Label className="text-white fs-14">Portfolio</Form.Label>
                        <Form.Control
                            type="text"
                            name="portfolio"
                            className="form-input-login"
                            value={perfil?.portfolio || ""}
                            onChange={handleChange}
                            placeholder="Portfolio"
                        />
                    </Form.Group>
                    {
                        countrys
                        &&
                        <Form.Group className="mb-3 col-lg-6" controlId="firstname">
                            <Form.Label className="text-white fs-14">País</Form.Label>
                            <Select
                                value={selectedCountry}
                                onChange={handleCountryChange}
                                options={countrys.map((country) => ({ value: country.code.toUpperCase(), label: country.name }))}
                                isSearchable
                                placeholder="Selecione um país"
                                onInputChange={handleCountryInputChange}
                            />
                        </Form.Group>
                    }
                    <Form.Group className="mb-3 col-lg-6" controlId="firstname">
                        <Form.Label className="text-white fs-14">Cidade</Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            className="form-input-login"
                            value={perfil?.city || ""}
                            onChange={handleChange}
                            placeholder="Cidade"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 col-12" controlId="firstname">
                        <Form.Label className="text-white fs-14">Endereço</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            className="form-input-login"
                            value={perfil?.address || ""}
                            onChange={handleChange}
                            placeholder="Endereço"
                        />
                    </Form.Group>
                </div>
            </div>
        </Form>
    )

}
