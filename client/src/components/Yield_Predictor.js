import React, { useState } from 'react';
import axios from 'axios';
const YieldPredictionForm = () => {
    const initialState = {
      State: '',
      District: '',
      Crop: '',
      Season: '',
      Area: 0
    };
  const [formData, setFormData] = useState(initialState);
  const [districts, setDistricts] = useState([]);
  const [yieldPrediction, setYieldPrediction] = useState(null); 
  const [estimatedProfit, setEstimatedProfit] = useState(null);
  const statesData = {
    'Andaman and Nicobar Islands': ['NICOBARS', 'NORTH AND MIDDLE ANDAMAN', 'SOUTH ANDAMANS', 'Andaman and Nicobar Islands'],
    'Andhra Pradesh': ['ANANTAPUR', 'EAST GODAVARI', 'KRISHNA', 'VIZIANAGARAM', 'WEST GODAVARI', 'ADILABAD', 'CHITTOOR', 'GUNTUR', 'KADAPA', 'KARIMNAGAR', 'KHAMMAM', 'KURNOOL', 'MAHBUBNAGAR', 'MEDAK', 'NALGONDA', 'NIZAMABAD', 'PRAKASAM', 'RANGAREDDI', 'SPSR NELLORE', 'SRIKAKULAM', 'VISAKHAPATANAM', 'WARANGAL', 'HYDERABAD'],
    'Arunachal Pradesh': ['CHANGLANG', 'DIBANG VALLEY', 'EAST KAMENG', 'EAST SIANG', 'KURUNG KUMEY', 'LOHIT', 'LOWER DIBANG VALLEY', 'LOWER SUBANSIRI', 'PAPUM PARE', 'TAWANG', 'TIRAP', 'UPPER SIANG', 'UPPER SUBANSIRI', 'WEST KAMENG', 'WEST SIANG', 'ANJAW', 'KRA DAADI', 'LONGDING', 'NAMSAI', 'SIANG', 'KAMLE', 'LOWER SIANG', 'LEPARADA', 'PAKKE KESSANG', 'SHI YOMI'],
    'Assam': ['BARPETA', 'BONGAIGAON', 'CACHAR', 'DARRANG', 'DHEMAJI', 'DHUBRI', 'DIBRUGARH', 'DIMA HASAO', 'GOALPARA', 'GOLAGHAT', 'HAILAKANDI', 'JORHAT', 'KAMRUP', 'KARBI ANGLONG', 'KARIMGANJ', 'KOKRAJHAR', 'LAKHIMPUR', 'MARIGAON', 'NAGAON', 'NALBARI', 'SIVASAGAR', 'SONITPUR', 'TINSUKIA', 'BAKSA', 'CHIRANG', 'KAMRUP METRO', 'UDALGURI', 'BISWANATH', 'CHARAIDEO', 'HOJAI', 'MAJULI', 'SOUTH SALMARA MANCACHAR', 'WEST KARBI ANGLONG'],
    'Bihar': ['ARARIA', 'ARWAL', 'AURANGABAD', 'BANKA', 'BEGUSARAI', 'BHAGALPUR', 'BHOJPUR', 'BUXAR', 'DARBHANGA', 'GAYA', 'GOPALGANJ', 'JAMUI', 'JEHANABAD', 'KAIMUR (BHABUA)', 'KATIHAR', 'KHAGARIA', 'KISHANGANJ', 'LAKHISARAI', 'MADHEPURA', 'MADHUBANI', 'MUNGER', 'MUZAFFARPUR', 'NALANDA', 'NAWADA', 'PASHCHIM CHAMPARAN', 'PATNA', 'PURBI CHAMPARAN', 'PURNIA', 'ROHTAS', 'SAHARSA', 'SAMASTIPUR', 'SARAN', 'SHEIKHPURA', 'SHEOHAR', 'SITAMARHI', 'SIWAN', 'SUPAUL', 'VAISHALI', 'BOKARO', 'CHATRA', 'DEOGHAR', 'DHANBAD', 'DUMKA', 'EAST SINGHBUM', 'GARHWA', 'GIRIDIH', 'GODDA', 'GUMLA', 'HAZARIBAGH', 'KODERMA', 'LOHARDAGA', 'PAKUR', 'PALAMU', 'RANCHI', 'SAHEBGANJ', 'WEST SINGHBHUM'],
    'Chandigarh': ['CHANDIGARH'],
    'Chhattisgarh': ['BASTAR', 'BILASPUR', 'DANTEWADA', 'DHAMTARI', 'DURG', 'JANJGIR-CHAMPA', 'JASHPUR', 'KABIRDHAM', 'KANKER', 'KORBA', 'KOREA', 'MAHASAMUND', 'RAIGARH', 'RAIPUR', 'RAJNANDGAON', 'SURGUJA', 'BIJAPUR', 'NARAYANPUR', 'BALOD', 'BALODA BAZAR', 'BALRAMPUR', 'BEMETARA', 'GARIYABAND', 'KONDAGAON', 'MUNGELI', 'SUKMA', 'SURAJPUR', 'GAURELLA-PENDRA-MARWAHI'],
    'Dadra and Nagar Haveli': ['DADRA AND NAGAR HAVELI'],
    'Daman and Diu': ['Daman and Diu', 'DIU', 'DAMAN'],
    'Delhi': ['Delhi', 'DELHI_TOTAL'],
    'Goa': ['Goa', 'NORTH GOA', 'SOUTH GOA'],
    'Gujarat': ['AHMADABAD', 'AMRELI', 'ANAND', 'BANAS KANTHA', 'BHARUCH', 'BHAVNAGAR', 'DANG', 'DOHAD', 'GANDHINAGAR', 'JAMNAGAR', 'JUNAGADH', 'KACHCHH', 'KHEDA', 'MAHESANA', 'NARMADA', 'NAVSARI', 'PANCH MAHALS', 'PATAN', 'PORBANDAR', 'RAJKOT', 'SABAR KANTHA', 'SURAT', 'SURENDRANAGAR', 'VADODARA', 'VALSAD', 'TAPI', 'ARAVALLI', 'BOTAD', 'CHHOTAUDEPUR', 'GIR SOMNATH', 'MAHISAGAR', 'DEVBHUMI DWARKA', 'MORBI'],
    'Haryana': ['AMBALA', 'BHIWANI', 'FARIDABAD', 'FATEHABAD', 'GURGAON', 'HISAR', 'JHAJJAR', 'JIND', 'KAITHAL', 'KARNAL', 'KURUKSHETRA', 'MAHENDRAGARH', 'PANCHKULA', 'PANIPAT', 'REWARI', 'ROHTAK', 'SIRSA', 'SONIPAT', 'YAMUNANAGAR', 'MEWAT', 'PALWAL', 'CHARKI DADRI'],
    'Himachal Pradesh': ['BILASPUR', 'KANGRA', 'KULLU', 'MANDI', 'SHIMLA', 'SOLAN', 'UNA', 'CHAMBA', 'HAMIRPUR', 'SIRMAUR', 'KINNAUR', 'LAHUL AND SPITI'],
    'Jammu and Kashmir': ['DODA', 'JAMMU', 'KATHUA', 'RAJAURI', 'UDHAMPUR', 'KARGIL', 'LEH LADAKH', 'SRINAGAR', 'BADGAM', 'BARAMULLA', 'POONCH', 'PULWAMA', 'ANANTNAG', 'KUPWARA', 'REASI', 'SAMBA', 'KISHTWAR', 'RAMBAN', 'KULGAM', 'BANDIPORA', 'GANDERBAL', 'SHOPIAN'],
    'Jharkhand': ['CHATRA', 'DUMKA', 'GARHWA', 'GODDA', 'GUMLA', 'HAZARIBAGH', 'KODERMA', 'LATEHAR', 'LOHARDAGA', 'PAKUR', 'PALAMU', 'RANCHI', 'SAHEBGANJ', 'SARAIKELA KHARSAWAN', 'SIMDEGA', 'WEST SINGHBHUM', 'BOKARO', 'DEOGHAR', 'DHANBAD', 'EAST SINGHBUM', 'GIRIDIH', 'JAMTARA', 'KHUNTI', 'RAMGARH'],
    'Karnataka': ['BAGALKOT', 'BANGALORE RURAL', 'BELGAUM', 'BELLARY', 'BENGALURU URBAN', 'CHAMARAJANAGAR', 'CHIKMAGALUR', 'CHITRADURGA', 'DAKSHIN KANNAD', 'DAVANGERE', 'DHARWAD', 'GADAG', 'HASSAN', 'HAVERI', 'KODAGU', 'KOLAR', 'MANDYA', 'MYSORE', 'SHIMOGA', 'TUMKUR', 'UDUPI', 'UTTAR KANNAD', 'BIDAR', 'BIJAPUR', 'GULBARGA', 'KOPPAL', 'RAICHUR', 'RAMANAGARA', 'CHIKBALLAPUR', 'YADGIR', 'BAGALKOTE', 'BALLARI', 'BELAGAVI', 'CHAMARAJANAGARA', 'CHIKKABALLAPURA', 'CHIKKAMAGALURU', 'DAKSHINA KANNADA', 'MYSURU', 'SHIVAMOGGA', 'TUMAKURU', 'UTTARA KANNADA', 'VIJAYAPURA', 'KALABURAGI', 'YADAGIRI'],
    'Kerala': ['ALAPPUZHA', 'ERNAKULAM', 'IDUKKI', 'KANNUR', 'KASARAGOD', 'KOLLAM', 'KOTTAYAM', 'KOZHIKODE', 'MALAPPURAM', 'PALAKKAD', 'PATHANAMTHITTA', 'THIRUVANANTHAPURAM', 'THRISSUR', 'WAYANAD'],
    'Madhya Pradesh': ['ANUPPUR', 'ASHOKNAGAR', 'BALAGHAT', 'BARWANI', 'BETUL', 'BHIND', 'BHOPAL', 'BURHANPUR', 'CHHATARPUR', 'CHHINDWARA', 'DAMOH', 'DATIA', 'DEWAS', 'DHAR', 'DINDORI', 'GUNA', 'GWALIOR', 'HARDA', 'HOSHANGABAD', 'INDORE', 'JABALPUR', 'JHABUA', 'KATNI', 'KHANDWA', 'KHARGONE', 'MANDLA', 'MANDSAUR', 'MORENA', 'NARSINGHPUR', 'NEEMUCH', 'PANNA', 'RAISEN', 'RAJGARH', 'RATLAM', 'REWA', 'SAGAR', 'SATNA', 'SEHORE', 'SEONI', 'SHAHDOL', 'SHAJAPUR', 'SHEOPUR', 'SHIVPURI', 'SIDHI', 'TIKAMGARH', 'UJJAIN', 'UMARIA', 'VIDISHA', 'ALIRAJPUR', 'SINGRAULI', 'AGAR MALWA', 'NIWARI', 'BASTAR', 'BILASPUR', 'DANTEWADA', 'DHAMTARI', 'DURG', 'JANJGIR-CHAMPA', 'JASHPUR', 'KABIRDHAM', 'KANKER', 'KORBA', 'KOREA', 'MAHASAMUND', 'RAIPUR', 'RAJNANDGAON', 'SURGUJA'],
    'Maharashtra': ['AHMEDNAGAR', 'AKOLA', 'AMRAVATI', 'AURANGABAD', 'BEED', 'BHANDARA', 'BULDHANA', 'CHANDRAPUR', 'DHULE', 'GADCHIROLI', 'GONDIA', 'HINGOLI', 'JALGAON', 'JALNA', 'KOLHAPUR', 'LATUR', 'NAGPUR', 'NANDED', 'NANDURBAR', 'NASHIK', 'OSMANABAD', 'PARBHANI', 'PUNE', 'RAIGAD', 'RATNAGIRI', 'SANGLI', 'SATARA', 'SOLAPUR', 'THANE', 'WARDHA', 'WASHIM', 'YAVATMAL', 'SINDHUDURG', 'PALGHAR', 'MUMBAI SUBURBAN', 'MUMBAI'],
    'Manipur': ['SENAPATI', 'BISHNUPUR', 'CHANDEL', 'CHURACHANDPUR', 'IMPHAL EAST', 'IMPHAL WEST', 'TAMENGLONG', 'THOUBAL', 'UKHRUL'],
    'Meghalaya': ['EAST GARO HILLS', 'EAST JAINTIA HILLS', 'EAST KHASI HILLS', 'RI BHOI', 'SOUTH GARO HILLS', 'WEST GARO HILLS', 'WEST KHASI HILLS', 'NORTH GARO HILLS', 'SOUTH WEST GARO HILLS', 'SOUTH WEST KHASI HILLS', 'WEST JAINTIA HILLS'],
    'Mizoram': ['AIZAWL', 'CHAMPHAI', 'KOLASIB', 'LUNGLEI', 'MAMIT', 'SAIHA', 'LAWNGTLAI', 'SERCHHIP'],
    'Nagaland': ['DIMAPUR', 'KOHIMA', 'MOKOKCHUNG', 'MON', 'PHEK', 'TUENSANG', 'WOKHA', 'ZUNHEBOTO', 'KIPHIRE', 'LONGLENG', 'PEREN'],
    'Odisha': ['ANUGUL', 'BALANGIR', 'BALESHWAR', 'BARGARH', 'BHADRAK', 'BOUDH', 'CUTTACK', 'DEOGARH', 'DHENKANAL', 'GAJAPATI', 'GANJAM', 'JAGATSINGHAPUR', 'JAJAPUR', 'JHARSUGUDA', 'KALAHANDI', 'KANDHAMAL', 'KENDRAPARA', 'KENDUJHAR', 'KHORDHA', 'KORAPUT', 'MALKANGIRI', 'MAYURBHANJ', 'NABARANGPUR', 'NAYAGARH', 'NUAPADA', 'RAYAGADA', 'SAMBALPUR', 'SONEPUR', 'SUNDARGARH', 'PURI'],
    'Puducherry': ['MAHE', 'PONDICHERRY', 'KARAIKAL', 'YANAM'],
    'Punjab': ['AMRITSAR', 'BATHINDA', 'FARIDKOT', 'FATEHGARH SAHIB', 'FIROZEPUR', 'HOSHIARPUR', 'JALANDHAR', 'KAPURTHALA', 'LUDHIANA', 'MOGA', 'MUKTSAR', 'NAWANSHAHR', 'PATIALA', 'RUPNAGAR', 'SANGRUR', 'MANSA', 'GURDASPUR', 'S', 'TARN TARAN', 'BARNALA', 'FAZILKA', 'PATHANKOT', 'SHAHID BHAGAT SINGH NAGAR'],
    'Rajasthan': ['AJMER', 'ALWAR', 'BANSWARA', 'BARAN', 'BHARATPUR', 'BHILWARA', 'BIKANER', 'BUNDI', 'CHITTORGARH', 'DAUSA', 'DHOLPUR', 'DUNGARPUR', 'GANGANAGAR', 'HANUMANGARH', 'JAIPUR', 'JAISALMER', 'JALORE', 'JHALAWAR', 'KARAULI', 'KOTA', 'NAGAUR', 'PALI', 'RAJSAMAND', 'SAWAI MADHOPUR', 'SIKAR', 'SIROHI', 'TONK', 'UDAIPUR', 'BARMER', 'CHURU', 'JHUNJHUNU', 'JODHPUR', 'PRATAPGARH'],
    'Sikkim': ['EAST DISTRICT', 'NORTH DISTRICT', 'SOUTH DISTRICT', 'WEST DISTRICT'],
    'Tamil Nadu': ['COIMBATORE', 'DHARMAPURI', 'DINDIGUL', 'ERODE', 'KANNIYAKUMARI', 'KARUR', 'KRISHNAGIRI', 'NAGAPATTINAM', 'NAMAKKAL', 'PERAMBALUR', 'SALEM', 'THANJAVUR', 'THE NILGIRIS', 'THENI', 'THIRUVARUR', 'TIRUCHIRAPPALLI', 'TIRUNELVELI', 'VIRUDHUNAGAR', 'CUDDALORE', 'KANCHIPURAM', 'MADURAI', 'PUDUKKOTTAI', 'RAMANATHAPURAM', 'SIVAGANGA', 'THIRUVALLUR', 'THOOTHUKUDI', 'TIRUVANNAMALAI', 'VELLORE', 'VILLUPURAM', 'TIRUPPUR', 'ARIYALUR', 'CHENNAI', 'TUTICORIN', 'KALLAKURICHI', 'TENKASI', 'TIRUPATHUR', 'CHENGALPATTU', 'RANIPET'],
    'Tripura': ['DHALAI', 'NORTH TRIPURA', 'SOUTH TRIPURA', 'WEST TRIPURA', 'GOMATI', 'KHOWAI', 'SEPAHIJALA', 'UNAKOTI'],
    'Uttar Pradesh': ['AGRA', 'ALIGARH', 'ALLAHABAD', 'AMBEDKAR NAGAR', 'AMROHA', 'AURAIYA', 'AZAMGARH', 'BAGHPAT', 'BAHRAICH', 'BALLIA', 'BALRAMPUR', 'BANDA', 'BARABANKI', 'BAREILLY', 'BASTI', 'BIJNOR', 'BUDAUN', 'BULANDSHAHR', 'CHANDAULI', 'CHITRAKOOT', 'DEORIA', 'ETAH', 'ETAWAH', 'FAIZABAD', 'FARRUKHABAD', 'FATEHPUR', 'FIROZABAD', 'GAUTAM BUDDHA NAGAR', 'GHAZIABAD', 'GHAZIPUR', 'GONDA', 'GORAKHPUR', 'HAMIRPUR', 'HAPUR', 'HARDOI', 'HATHRAS', 'JALAUN', 'JAUNPUR', 'JHANSI', 'KANNAUJ', 'KANPUR DEHAT', 'KANPUR NAGAR', 'KASGANJ', 'KAUSHAMBI', 'KHERI', 'KUSHI NAGAR', 'LALITPUR', 'LUCKNOW', 'MAHARAJGANJ', 'MAHOBA', 'MAINPURI', 'MATHURA', 'MAU', 'MEERUT', 'MIRZAPUR', 'MORADABAD', 'MUZAFFARNAGAR', 'PILIBHIT', 'RAE BARELI', 'RAMPUR', 'SAHARANPUR', 'SAMBHAL', 'SANT KABEER NAGAR', 'SANT RAVIDAS NAGAR', 'SHAHJAHANPUR', 'SHAMLI', 'SHRAVASTI', 'SIDDHARTH NAGAR', 'SITAPUR', 'SONBHADRA', 'SULTANPUR', 'UNNAO', 'VARANASI', 'AMETHI', 'BAGHPAT', 'BAREILLY', 'BUDAUN', 'BULANDSHAHR', 'DEORIA', 'ETAWAH', 'FAIZABAD', 'FARRUKHABAD', 'FATEHPUR', 'FIROZABAD', 'GAUTAM BUDDHA NAGAR', 'GHAZIABAD', 'GHAZIPUR', 'GONDA', 'GORAKHPUR', 'HAMIRPUR', 'HAPUR', 'HARDOI', 'HATHRAS', 'JALAUN', 'JAUNPUR', 'JHANSI', 'KANNAUJ', 'KANPUR DEHAT', 'KANPUR NAGAR', 'KASGANJ', 'KAUSHAMBI', 'KHERI', 'KUSHI NAGAR', 'LALITPUR', 'LUCKNOW', 'MAHARAJGANJ', 'MAHOBA', 'MAINPURI', 'MATHURA', 'MAU', 'MEERUT', 'MIRZAPUR', 'MORADABAD', 'MUZAFFARNAGAR', 'PILIBHIT', 'RAE BARELI', 'RAMPUR', 'SAHARANPUR', 'SAMBHAL', 'SANT KABEER NAGAR', 'SANT RAVIDAS NAGAR', 'SHAHJAHANPUR', 'SHAMLI', 'SHRAVASTI', 'SIDDHARTH NAGAR', 'SITAPUR', 'SONBHADRA', 'SULTANPUR', 'UNNAO', 'VARANASI', 'AMETHI'],
    'Uttarakhand': ['ALMORA', 'BAGESHWAR', 'CHAMOLI', 'CHAMPAWAT', 'DEHRADUN', 'HARIDWAR', 'NAINITAL', 'PAURI GARHWAL', 'PITHORAGARH', 'RUDRAPRAYAG', 'TEHRI GARHWAL', 'UDHAM SINGH NAGAR', 'UTTAR KASHI', 'CHAMPAWAT', 'NAINITAL', 'PITHORAGARH', 'UDAM SINGH NAGAR', 'KOTDWARA'],
    'West Bengal': ['BANKURA', 'BARDHAMAN', 'BIRBHUM', 'COOCHBEHAR', 'DARJEELING', 'DINAJPUR DAKSHIN', 'DINAJPUR UTTAR', 'HOOGHLY', 'HOWRAH', 'JALPAIGURI', 'MALDAH', 'MEDINIPUR EAST', 'MEDINIPUR WEST', 'MURSHIDABAD', 'NADIA', 'PURULIA', '24 PARAGANAS NORTH', '24 PARAGANAS SOUTH', 'ALIPURDUAR', 'JHARGRAM', 'KALIMPONG', 'KOLKATA', 'UTTAR DINAJPUR']
};


const distinct_crops = ['Arecanut', 'Banana', 'Black pepper', 'Cashewnut', 'Coconut', 'Dry chillies',
 'Ginger', 'Other Kharif pulses', 'other oilseeds', 'Rice', 'Sugarcane',
 'Sweet potato', 'Arhar/Tur', 'Bajra', 'Castor seed', 'Coriander',
 'Cotton(lint)', 'Gram', 'Groundnut', 'Horse-gram', 'Jowar', 'Linseed', 'Maize',
 'Mesta', 'Moong(Green Gram)', 'Niger seed', 'Onion', 'Other Rabi pulses',
 'Potato', 'Ragi', 'Rapeseed &Mustard', 'Safflower', 'Sesamum', 'Small millets',
 'Soyabean', 'Sunflower', 'Tapioca', 'Tobacco', 'Turmeric', 'Urad', 'Wheat',
 'Oilseeds total', 'Jute', 'Masoor', 'Peas & beans (Pulses)', 'Barley',
 'Garlic', 'Khesari', 'Sannhamp', 'Guar seed', 'Moth', 'Cardamom',
 'Other Cereals', 'Cowpea(Lobia)', 'Dry Ginger', 'Other Summer Pulses']

const distinct_seasons = ['Kharif', 'Whole Year', 'Rabi', 'Autumn', 'Summer', 'Winter']
distinct_crops.sort();
distinct_seasons.sort();


  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({
      ...formData,
      State: selectedState,
      District: '' // Reset district when state changes
    });
    setDistricts(statesData[selectedState]);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData(initialState);
    setDistricts([]);
    setYieldPrediction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response1 = await axios.post('/predict-yield', formData);
      const yieldPrediction = response1.data.yieldPrediction;
      setYieldPrediction(yieldPrediction);
      // const yieldValue = yieldPrediction
      // console.log(yieldValue);
      // console.log(formData.Crop);
      const response = await axios.post('/calculate-profit', { yieldValue: yieldPrediction, crop: formData.Crop });
      const { estimatedProfit } = response.data;
      console.log(estimatedProfit);
      setEstimatedProfit(estimatedProfit);
      
    } catch (error) {
      console.error('Error:', error);
      // Handle error, display error message, etc.
    }
  };

  return (
    <div>
      <h2 className = "y_head">Yield Predictor</h2>
      <form onSubmit={handleSubmit}>
        <label>
          State:
          <select name="State" value={formData.State} onChange={handleStateChange}>
            <option value="">Select State</option>
            {Object.keys(statesData).map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          District:
          <select name="District" value={formData.District} onChange={handleChange}>
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </label>
        <br />


        <label>
          Crop:
          <select name="Crop" value={formData.Crop} onChange={handleChange}>
            <option value="">Select Crop</option>
            {distinct_crops.map((crop) => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Season:
          <select name="Season" value={formData.Season} onChange={handleChange}>
            <option value="">Select Season</option>
            {distinct_seasons.map((season) => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Area (in Hectares):
          <input type="number" name="Area" value={formData.Area} onChange={handleChange} />
        </label>
        <br />
        <br />
        {/* Add other form fields here */}
        <button type="submit">Predict Yield</button>
        <button type="button" onClick={resetForm}>Reset</button>
      </form>
      {yieldPrediction !== null && ( // Display yield prediction if available
        <div className = "y_out">
          <h3>Yield Prediction</h3>
          <p>{`Predicted Yield: ${yieldPrediction.toFixed(2)} tonnes/hectare`}</p>
        </div>
      )}
      {estimatedProfit !== null && (
        <div className="y_out">
        <h3>Estimated Revenue:</h3>
        <p>&#x20B9; {estimatedProfit.toLocaleString('en-IN')}</p>
      </div>
      
      
      )}
    </div>
  );
};

export default YieldPredictionForm;
