<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Customer' : 'Create Customer' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <CTabs activeItemKey="general">
              <CTabList variant=pills>
                <CTab itemKey="general">General</CTab>
                <CTab itemKey="project">Project</CTab>
                <CTab itemKey="group">Group</CTab>
                <CTab itemKey="payment"> Payment </CTab>
                <CTab itemKey="discount"> Discount </CTab>
                <CTab itemKey="tradingTerms"> Trading Terms </CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel class="p-3" itemKey="general">
                  <div class="d-flex justify-content-between">
                    <div class="mb-3">
                      <div class="mb-3" v-if="isEdit">
                        <CFormLabel for="inputCode">Code*</CFormLabel>
                        <CFormInput id="inputCode" type="text" placeholder="" v-model="form.code" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputName">Name*</CFormLabel>
                        <CFormInput id="inputName" type="text" placeholder="" v-model="form.name" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputUniq">Uniq</CFormLabel>
                        <CFormInput id="inputUniq" type="text" placeholder="" v-model="form.uniq" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputAddressShip">Address Ship</CFormLabel>
                        <CFormTextarea id="inputAddressShip" rows="3" v-model="form.addressShip" ></CFormTextarea>
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputNPWP">NPWP</CFormLabel>
                        <CFormInput id="inputNPWP" type="text" v-model="form.npwp" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputNPWPBill">NPWP Bill</CFormLabel>
                        <CFormInput id="inputNPWPBill" type="text" v-model="form.npwpBill" />
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="mb-3">
                        <CFormLabel for="inputMobile">Mobile*</CFormLabel>
                        <CFormInput id="inputMobile" type="text" placeholder="" v-model="form.phone" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputPhone">Phone</CFormLabel>
                        <CFormInput id="inputPhone" type="text" placeholder="" v-model="form.telefax" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputEmail">Email</CFormLabel>
                        <CFormInput id="inputEmail" type="email" placeholder="" v-model="form.email" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputAddressBill">Address Bill</CFormLabel>
                        <CFormTextarea id="inputAddressBill" rows="3" v-model="form.addressBill" ></CFormTextarea>
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputContact">Contact Person</CFormLabel>
                        <CFormInput id="inputContact" type="text" v-model="form.contact" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputBusinessType">BusinessType</CFormLabel>
                        <multiselect
                          v-model="selectedBusinessType"
                          :options="businessTypeOptions || []"
                          :multiple="false"
                          :track-by="'name'"
                          label="name"
                          placeholder="Pick some options"
                          :close-on-select="true"
                        />
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="mb-3">
                        <CFormLabel for="inputTerms">Terms*</CFormLabel>
                        <CFormInput id="inputTerms" type="number" placeholder="" v-model="form.terms" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputGroup">Group*</CFormLabel>
                        <multiselect
                          v-model="selectedGroup"
                          :options="groupOptions || []"
                          :multiple="false"
                          :track-by="'name'"
                          label="name"
                          placeholder="Pick some options"
                          :close-on-select="true"
                        />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputCurrency">Currency*</CFormLabel>
                        <multiselect
                          v-model="selectedCurrency"
                          :options="currencyOptions || []"
                          :multiple="false"
                          :track-by="'name'"
                          label="name"
                          placeholder="Pick some options"
                          :close-on-select="true"
                        />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputAddInfo">Add Info</CFormLabel>
                        <CFormTextarea id="inputAddInfo" rows="3" v-model="form.info" ></CFormTextarea>
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputIsActive" class="me-3">Active*</CFormLabel>
                        <CFormCheck
                          id="checkBoxIsActive1"
                          inline
                          type="radio"
                          name="isActiveRadioOptions"
                          value="1"
                          label="Yes"
                          v-model="form.is_active"
                        />
                        <CFormCheck
                          id="checkBoxIsActive2"
                          inline
                          type="radio"
                          name="isActiveRadioOptions"
                          value="0"
                          label="No"
                          v-model="form.is_active"
                        />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputIsOffice" class="me-3">Office</CFormLabel>
                        <CFormCheck
                          id="checkboxIsOffice1"
                          inline
                          type="radio"
                          name="isOfficeRadioOptions"
                          value="1"
                          label="Yes"
                          v-model="form.is_office"
                        />
                        <CFormCheck
                          id="checkboxIsOffice2"
                          inline
                          type="radio"
                          name="isOfficeRadioOptions"
                          value="0"
                          label="No"
                          v-model="form.is_office"
                        />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputExcludeDP" class="me-3">Exclude DP</CFormLabel>
                        <CFormCheck
                          id="checkboxExcludeDP1"
                          inline
                          type="radio"
                          name="excludeDPRadioOptions"
                          value="1"
                          label="Yes"
                          v-model="form.excludeDP"
                        />
                        <CFormCheck
                          id="checkboxExcludeDP2"
                          inline
                          type="radio"
                          name="excludeDPRadioOptions"
                          value="0"
                          label="No"
                          v-model="form.excludeDP"
                        />
                      </div>
                    </div>
                  </div>
                  <br/>
                  <div class="mb-3">
                    <CFormLabel for="inputHead">Head*</CFormLabel>
                    <CInputGroup class="mb-3">
                      <CFormInput v-model="form.locationHead" placeholder="" aria-label="Search" disabled aria-describedby="button-addon2" />
                      <CButton id="button-addon2" type="button" color="primary" disabled>
                        <i class="pi pi-search"></i>
                      </CButton>
                    </CInputGroup>
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="inputDepartment">Department*</CFormLabel>
                    <CInputGroup class="mb-3">
                      <CFormInput v-model="form.locationDepartment" placeholder="" aria-label="Search" disabled aria-describedby="button-addon2" />
                      <CButton id="button-addon2" type="button" color="primary" disabled>
                        <i class="pi pi-search"></i>
                      </CButton>
                    </CInputGroup>
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="inputLocation">Location*</CFormLabel>
                    <CInputGroup class="mb-3">
                      <CFormInput v-model="form.location" placeholder="" aria-label="Search" aria-describedby="button-addon2" />
                      <CButton id="button-addon2" type="button" color="primary" @click="modalLocation = true">
                        <i class="pi pi-search"></i>
                      </CButton>
                    </CInputGroup>
                    <LocationDialog
                          :modalLocation="modalLocation"
                          :locationList="locationList"
                          :filters="filters"
                          :selectedLocation="selectedLocation"
                          :lazyParams="lazyParams"
                          :loading="loading"
                          :pagination="pagination"
                          @update:modalLocation="modalLocation = $event"
                          @update:filters="filters = $event"
                          @update:selectedLocation="selectedLocation = $event"
                          @update:lazyParams="lazyParams = $event"
                          @choose="handleChoose"
                        />
                  </div>
                </CTabPanel>
                <CTabPanel class="p-3" itemKey="project">
                  <div class="mb-3">
                    <CFormLabel for="inputProjectAddress">Project Address</CFormLabel>
                    <Editor name="content" v-model="form.project" editorStyle="height: 320px" />
                  </div>
                </CTabPanel>
                <CTabPanel class="p-3" itemKey="group">
                  <div class="mb-3">
                    <CFormLabel for="inputBranch">Branch</CFormLabel>
                    <multiselect
                      v-model="selectedBranch"
                      :options="branchOptions || []"
                      :multiple="false"
                      :track-by="'name'"
                      label="name"
                      placeholder="Pick some options"
                      :close-on-select="true"
                    />
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="inputChannel">Channel</CFormLabel>
                    <multiselect
                      v-model="selectedChannel"
                      :options="channelOptions || []"
                      :multiple="false"
                      :track-by="'name'"
                      label="name"
                      placeholder="Pick some options"
                      :close-on-select="true"
                    />
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="inputSalesman">Salesman</CFormLabel>
                    <multiselect
                      v-model="selectedSalesman"
                      :options="salesmanOptions || []"
                      :multiple="false"
                      :track-by="'name'"
                      label="name"
                      placeholder="Pick some options"
                      :close-on-select="true"
                    />
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="inputType">Type/Category</CFormLabel>
                    <multiselect
                      v-model="selectedType"
                      :options="typeOptions || []"
                      :multiple="false"
                      :track-by="'name'"
                      label="name"
                      placeholder="Pick some options"
                      :close-on-select="true"
                    />
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="inputGroup">Group</CFormLabel>
                    <multiselect
                      v-model="selectedGroupGroup"
                      :options="groupGroupOptions || []"
                      :multiple="false"
                      :track-by="'name'"
                      label="name"
                      placeholder="Pick some options"
                      :close-on-select="true"
                    />
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="inputArea">Area</CFormLabel>
                    <multiselect
                      v-model="selectedArea"
                      :options="areaOptions || []"
                      :multiple="false"
                      :track-by="'name'"
                      label="name"
                      placeholder="Pick some options"
                      :close-on-select="true"
                    />
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="inputMarket">Market</CFormLabel>
                    <div class="d-flex">
                      <multiselect
                        v-model="selectedMarket"
                        :options="marketOptions || []"
                        :multiple="false"
                        :track-by="'name'"
                        label="name"
                        placeholder="Pick some options"
                        :close-on-select="true"
                      />
                      <multiselect
                        v-model="selectedMarket2"
                        :options="market2Options || []"
                        :multiple="false"
                        :track-by="'name'"
                        label="name"
                        placeholder="Pick some options"
                        :close-on-select="true"
                      />
                    </div>
                  </div>
                </CTabPanel>
                <CTabPanel class="p-3" itemKey="payment">
                  <div class="d-flex justify-content-between">
                    <div class="mb-3">
                      <div class="mb-3">
                        <CFormLabel for="inputInvoiceGroup">Invoice Group</CFormLabel>
                        <multiselect
                          v-model="selectedInvoiceGroup"
                          :options="invoiceGroupOptions || []"
                          :multiple="false"
                          :track-by="'name'"
                          label="name"
                          placeholder="Pick some options"
                          :close-on-select="true"
                        />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputTypePayment">Type Payment</CFormLabel>
                        <multiselect
                          v-model="selectedTypePayment"
                          :options="typePaymentOptions || []"
                          :multiple="false"
                          :track-by="'name'"
                          label="name"
                          placeholder="Pick some options"
                          :close-on-select="true"
                        />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputMaxInvoice">Max Invoice</CFormLabel>
                        <CFormInput id="inputMaxInvoice" type="text" placeholder="" v-model="form.maxInvoice" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputCondition">Condition</CFormLabel>
                        <multiselect
                          v-model="selectedCondition"
                          :options="coditionOptions || []"
                          :multiple="false"
                          :track-by="'name'"
                          label="name"
                          placeholder="Pick some options"
                          :close-on-select="true"
                        />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputNewOutlet">New Outlet</CFormLabel>
                        <multiselect
                          v-model="selectedNewOutlet"
                          :options="newOutletOptions || []"
                          :multiple="false"
                          :track-by="'name'"
                          label="name"
                          placeholder="Pick some options"
                          :close-on-select="true"
                        />
                      </div>
                    </div>
                    <div class="mb-3">
                      <div class="mb-3">
                        <CFormLabel for="inputLimit">Limit</CFormLabel>
                        <CFormInput id="inputLimit" type="text" placeholder="" v-model="form.limit" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputSisaSO">Sisa SO</CFormLabel>
                        <CFormInput id="inputSisaSO" type="text" placeholder="" v-model="form.sisaSO" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputLimitCash">Limit Cash</CFormLabel>
                        <CFormInput id="inputLimitCash" type="text" placeholder="" v-model="form.limitCash" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputLimitSO">Limit SO</CFormLabel>
                        <CFormInput id="inputLimitSO" type="text" v-model="form.limitSO" ></CFormInput>
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputAvailable">Available</CFormLabel>
                        <CFormInput id="inputAvailable" type="text" v-model="form.available" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputBalance">Balance</CFormLabel>
                        <CFormInput id="inputBalance" type="text" v-model="form.balance" />
                      </div>
                    </div>
                  </div>
                </CTabPanel>
                <CTabPanel class="p-3" itemKey="discount">
                  <div class="mb-3">
                    <CFormLabel for="inputRegularDiscount">Regular Discount</CFormLabel>
                    <CInputGroup class="mb-3">
                      <CFormInput id="inputRegularDiscount" type="text" placeholder="" v-model="form.regularDiscount" />
                      <CInputGroupText id="basic-addon2">%</CInputGroupText>
                    </CInputGroup>
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="inputDistributionCenterDiscount">Distribution Center Discount</CFormLabel>
                    <CInputGroup class="mb-3">
                      <CFormInput id="inputDistributionCenterDiscount" type="text" placeholder="" v-model="form.distributionCenterDiscount" />
                      <CInputGroupText id="basic-addon2">%</CInputGroupText>
                    </CInputGroup>
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="inputB2BDiscount">B2B Discount</CFormLabel>
                    <CInputGroup class="mb-3">
                      <CFormInput id="inputB2BDiscount" type="text" placeholder="" v-model="form.b2bDiscount" />
                      <CInputGroupText id="basic-addon2">%</CInputGroupText>
                    </CInputGroup>
                  </div>
                </CTabPanel>
                <CTabPanel class="p-3" itemKey="tradingTerms">
                  <div class="d-flex justify-content-between">
                    <div class="mb-3">
                      <h5>General</h5>
                      <div class="mb-3">
                        <CFormLabel for="inputTargetPenjualan">Target Penjualan</CFormLabel>
                        <CFormInput id="inputTargetPenjualan" type="text" placeholder="" v-model="form.targetPenjualan" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputJaminanTermurah">Jaminan Termurah*</CFormLabel>
                        <multiselect
                          v-model="selectedJaminanTermurah"
                          :options="jaminanTermurahOptions || []"
                          :multiple="false"
                          :track-by="'name'"
                          label="name"
                          placeholder="Pick some options"
                          :close-on-select="true"
                        />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputPotonganHarga">Potongan Harga</CFormLabel>
                        <CFormInput id="inputPotonganHarga" type="text" placeholder="" v-model="form.potonganHarga" />
                      </div>
                      <h5>Potongan Harga Reguler</h5>
                      <div class="mb-3">
                        <CFormLabel for="inputAwal">Awal</CFormLabel>
                        <CFormInput id="inputAwal" type="text" v-model="form.awal" ></CFormInput>
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputTambahan">Tambahan</CFormLabel>
                        <CFormInput id="inputTambahan" type="text" v-model="form.tambahan" />
                      </div>
                      <h5>Biaya Administrasi Pendaftaran</h5>
                      <div class="mb-3">
                        <CFormLabel for="inputBarangBaru">Barang Baru</CFormLabel>
                        <CFormInput id="inputBarangBaru" type="text" v-model="form.barangBaru" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputPenggantiDistributor">Pengganti Distributor</CFormLabel>
                        <CFormInput id="inputPenggantiDistributor" type="text" v-model="form.penggantiDistributor" />
                      </div>
                    </div>
                    <div class="mb-3">
                      <h5>Promotion Discount</h5>
                      <div class="mb-3">
                        <CFormLabel for="inputPromosiReguler">Promosi Reguler</CFormLabel>
                        <CFormInput id="inputPromosiReguler" type="text" placeholder="" v-model="form.promosiReguler" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputPromosiClearance">Promosi Clearance</CFormLabel>
                        <CFormInput id="inputPromosiClearance" type="text" placeholder="" v-model="form.promosiClearance" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputPromosiAcaraKhusus">Promosi Acara Khusus</CFormLabel>
                        <CFormInput id="inputPromosiAcaraKhusus" type="text" placeholder="" v-model="form.promosiAcaraKhusus" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputDiskonBarangBaru">Diskon Barang Baru</CFormLabel>
                        <CFormInput id="inputDiskonBarangBaru" type="text" v-model="form.diskonBarangBaru" ></CFormInput>
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputDiskonKartu">Diskon Kartu</CFormLabel>
                        <CFormInput id="inputDiskonKartu" type="text" v-model="form.diskonKartu" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputBiayaDistribusi">Biaya Distribusi</CFormLabel>
                        <CFormInput id="inputBiayaDistribusi" type="text" v-model="form.biayaDistribusi" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputBiayaBarangRusak">Biaya Barang Rusak</CFormLabel>
                        <CFormInput id="inputBiayaBarangRusak" type="text" v-model="form.biayaBarangRusak" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputSatuHargaNasional">Satu Harga Nasional</CFormLabel>
                        <CFormInput id="inputSatuHargaNasional" type="text" v-model="form.satuHargaNasional" />
                      </div>
                    </div>
                    <div class="mb-3">
                      <h5>Biaya Promosi</h5>
                      <div class="mb-3">
                        <CFormLabel for="inputPromotionSupport">Promotion Support</CFormLabel>
                        <CFormInput id="inputPromotionSupport" type="text" placeholder="" v-model="form.promotionSupport" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputJaminanKetersediaan">Jaminan Ketersediaan</CFormLabel>
                        <CFormInput id="inputJaminanKetersediaan" type="text" placeholder="" v-model="form.jaminanKetersediaan" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputBiayaSewaLightBox">Biaya Sewa Light Box</CFormLabel>
                        <CFormInput id="inputBiayaSewaLightBox" type="text" placeholder="" v-model="form.biayaSewaLightBox" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputBiayaPromosiBarangBaru">Biaya Promosi Barang Baru</CFormLabel>
                        <CFormInput id="inputBiayaPromosiBarangBaru" type="text" v-model="form.biayaPromosiBarangBaru"/>
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputPotonganHargaKhusus">Potongan Harga Khusus</CFormLabel>
                        <CFormInput id="inputPotonganHargaKhusus" type="text" v-model="form.potonganHargaKhusus" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputServiceLevel">Service Level</CFormLabel>
                        <CFormInput id="inputServiceLevel" type="text" v-model="form.serviceLevel" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputDendaPengirimanKeToko">Denda Pengiriman Langsung Ke Toko</CFormLabel>
                        <CFormInput id="inputDendaPengirimanKeToko" type="text" v-model="form.dendaPengirimanKeToko" />
                      </div>
                    </div>
                    <div class="mb-3">
                      <h5>Dukungan Promosi Lain-Lain</h5>
                      <div class="mb-3">
                        <CFormLabel for="inputBiayaSampling">Biaya Sampling dan/atau Demo Produk</CFormLabel>
                        <CFormInput id="inputBiayaSampling" type="text" placeholder="" v-model="form.biayaSampling" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputBiayaHadiah">Biaya Hadiah dan/atau Games</CFormLabel>
                        <CFormInput id="inputBiayaHadiah" type="text" placeholder="" v-model="form.biayaHadiah" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputBiayaPartisipasi">Biaya Partisipasi Pembukaan Toko</CFormLabel>
                        <CFormInput id="inputBiayaPartisipasi" type="text" placeholder="" v-model="form.biayaPartisipasi" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputPotonganHargaPembukaan">Potongan Harga Pembukaan Toko Baru</CFormLabel>
                        <CFormInput id="inputPotonganHargaPembukaan" type="text" v-model="form.potonganHargaPembukaan" ></CFormInput>
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputBiayaPartisipasiUlangTahun">Biaya Partisipasi Ulang Tahun Pertama</CFormLabel>
                        <CFormInput id="inputBiayaPartisipasiUlangTahun" type="text" v-model="form.biayaPartisipasiUlangTahun" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputDendaAtasBarangTidakDikirim">Denda Atas Barang Tidak Dikirim Selama Persiapan Pembukaan Toko</CFormLabel>
                        <CFormInput id="inputDendaAtasBarangTidakDikirim" type="text" v-model="form.dendaBarangTidakDikirim" />
                      </div>
                    </div>
                  </div>
                </CTabPanel>
              </CTabContent>
            </CTabs>
          <div class="mb-3">
            <crudButton @revert="revert" @save="save" @back="back" />
          </div>
        </CForm>
    </CCardBody>
  </CCard>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import crudButton from '@/components/crudButton.vue'
import Swal from 'sweetalert2'
import Multiselect from 'vue-multiselect'
import Editor from 'primevue/editor';
import LocationDialog from '@/components/LocationDialog.vue'

const form = ref({
  id: null,
  code: '',
  name: '',
  uniq: '',
  addressShip: '',
  npwp: '',
  npwpBill: '',
  phone: '',
  telefax: '',
  email: '',
  contact: '',
  businessType: '',
  terms: '0',
  project: '',
  limit: '',
  sisaSO: '',
  limitCash: 1,
  limitSO: '',
  available: '',
  balance: '',
  regularDiscount: '',
  distributionCenterDiscount: '',
  b2bDiscount: '',
  targetPenjualan: '',
  potonganHarga: '',
  awal: '',
  tambahan: '',
  barangBaru: '',
  penggantiDistributor: '',
  promosiReguler: '',
  promosiClearance: '',
  promosiAcaraKhusus: '',
  diskonBarangBaru: '',
  diskonKartu: '',
  biayaDistribusi: '',
  biayaBarangRusak: '',
  satuHargaNasional: '',
  promotionSupport: '',
  jaminanKetersediaan: '',
  biayaSewaLightBox: '',
  biayaPromosiBarangBaru: '',
  potonganHargaKhusus: '',
  serviceLevel: '',
  dendaPengirimanToko: '',
  biayaSampling: '',
  biayaHadiah: '',
  biayaPartisipasi: '',
  potonganHargaPembukaan: '',
  biayaPartisipasiUlangTahun: '',
  dendaBarangTidakDikirim: '',
  maxInvoice: '',
  info:'',
  locationHead: '1000000',
  locationDepartment: '1300000',
  location:'1000000',
  is_office: '1',
  excludeDP: '0',
  is_active: '1' // Default to active
})
const token = localStorage.getItem("token");

// For detecting if we're editing or creating a company
const isEdit = ref(false)
const modalLocation = ref(false);
const locationList = ref([]);
const selectedLocation = ref();
const selectedBusinessType = ref(null);
const businessTypeOptions = ref([]);
const selectedCurrency = ref(null);
const currencyOptions = ref([]);
const selectedGroup = ref(null);
const groupOptions = ref([]);
const selectedNewOutlet = ref(null);
const newOutletOptions = [
  { value: 1, name: 'Yes' },
  { value: 0, name: 'No' },
]
const filters = ref({
  global: { value: null },
});
const loading = ref(false);
const lazyParams = ref({
  page: 1,
  rows: 10,
  search: ''
});
const onPage = (event) => {
  lazyParams.value = {
    ...lazyParams.value,
    page: event.page + 1,
    rows: event.rows
  };
  loadData();
};
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});
const searchTimeout = ref(null);
const onSearch = (event) => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    lazyParams.value = {
      ...lazyParams.value,
      page: 1,
      search: filters.value.global.value || '' // Get search value from filters
    };
    loadData();
  }, 300);
};
const loadData = async () => {
  try {
    loading.value = true;
    await fetchLocationData(lazyParams.value.page, lazyParams.value.search);
  } finally {
    loading.value = false;
  }
};
const updateSelectedLocation = (newSelectedLocation) => {
  console.log(newSelectedLocation)
  selectedLocation.value = newSelectedLocation;
}
const handleChoose = () => {
  if (selectedLocation.value) {
    // Here you can process the selected items
    console.log('Selected items:', selectedLocation.value);

    // Update your form or other data as needed
    // For example:
    form.value.location = selectedLocation.value.code || '';

    // Close the dialog
    modalLocation.value = false;
  } else {
    // Show error if no items selected
    Swal.fire({
      title: 'Warning',
      text: 'Please select at least one item',
      icon: 'warning'
    });
  }
};

// Get route params (id from URL)
const route = useRoute()
const router = useRouter()

const fetchLocationData = async (pageNumber = 1, keywords = '') => {
  try {
    const response = await axios.get(`/api/master/customer/cek_location_cust`, {
      params: {
        page: pageNumber,
        search: keywords,
        per_page: lazyParams.value.rows
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const locations = response.data.data
    locations.forEach((location) => {
      const mappedLocation = {
        id: location.id,
        code: location.code,
        name: location.name,
      };

      if (location.dimention_type === 3){
        locationList.value.push(mappedLocation);
      }

    pagination.currentPage = response.data.data.current_page;
    pagination.perPage = response.data.data.per_page;
    pagination.total = response.data.data.total;
    });
  } catch (error) {
    console.error('Error fetching location list:', error)
  }
}

watch(modalLocation, (newValue) => {
  if (newValue) {
    // Reset parameters and load initial data when dialog opens
    lazyParams.value = {
      page: 1,
      rows: 10,
      search: ''
    };
    filters.value = {
      global: { value: null }
    };
    loadData();
  }
});

const fetchBusinessType = async () => {
  try {
    const response = await axios.get(`/api/master/business_type/all`)
    const businessType = response.data.data
    businessTypeOptions.value = businessType.map(item => ({
      value: item.id,
      name: item.name,
    }));
  } catch (error) {
    console.error('Error fetching business type list:', error)
  }
}

const fetchCurrency = async () => {
  try {
    const response = await axios.get(`/api/master/currency`)
    const curr = response.data.data
    currencyOptions.value = curr.map(item => ({
      value: item.code,
      name: item.code,
    }));
    selectedCurrency.value = currencyOptions.value.find(option => option.value === 'IDR');
  } catch (error) {
    console.error('Error fetching currency list:', error)
  }
}

const fetchGroup = async () => {
  try {
    const response = await axios.get(`/api/master/customer/customer_group`)
    const custGroup = response.data.data
    groupOptions.value = custGroup.map(item => ({
      value: item.group,
      name: item.name,
    }));
  selectedGroup.value = groupOptions.value.find(option => option.value === '0101');
  } catch (error) {
    console.error('Error fetching group list:', error)
  }
}

// Fetch company data when editing
const fetchCustomerData = async (id) => {
  try {
    const response = await axios.get(`/api/master/customer/${id}`)
    const customer = response.data.data
    form.value = {
      ...customer,
      code: customer.accountNum,
      is_active: customer.is_active === 1 ? '1' : '0'
    }

    console.log(form.value)
  } catch (error) {
    console.error('Error fetching company data:', error)
  }
}

// Handle form submission (Create or Edit)
const save = async () => {
  const formData = new FormData()
  if(isEdit.value){
    formData.append('_method', 'PUT');
  }
  formData.append('code', form.value.code)
  formData.append('name', form.value.name)
  formData.append('uniq_name', form.value.uniq)
  formData.append('address', form.value.addressShip)
  formData.append('npwp', form.value.npwp)
  formData.append('npwp_bill', form.value.npwpBill)
  formData.append('phone', form.value.phone)
  formData.append('telefax', form.value.telefax)
  formData.append('email', form.value.email)
  formData.append('address_bill', form.value.addressBill)
  formData.append('contact', form.value.contact)
  formData.append('terms', form.value.terms)
  formData.append('project_address', form.value.project)
  formData.append('limit', form.value.limit)
  formData.append('limit_invoice', form.value.sisaSO)
  formData.append('limit_cash', form.value.limitCash)
  formData.append('limit_so', form.value.limitSO)
  formData.append('available', form.value.available)
  formData.append('balance', form.value.balance)
  formData.append('regular_discount', form.value.regularDiscount)
  formData.append('distribution_center_discount', form.value.distributionCenterDiscount)
  formData.append('anniversary_discount', form.value.b2bDiscount)
  formData.append('target_penjualan', form.value.targetPenjualan)
  formData.append('potonganHarga', form.value.potonganHarga)
  formData.append('reguuler_awal', form.value.awal)
  formData.append('reguler_tambahan', form.value.tambahan)
  formData.append('admin_barang_baru', form.value.barangBaru)
  formData.append('admin_pengganti_distributor', form.value.penggantiDistributor)
  formData.append('promosi_reguler', form.value.promosiReguler)
  formData.append('promosi_clearance', form.value.promosiClearance)
  formData.append('promosi_acara_khusus', form.value.promosiAcaraKhusus)
  formData.append('promosi_barang_baru', form.value.diskonBarangBaru)
  formData.append('promosi_diskon_kartu', form.value.diskonKartu)
  formData.append('lain_distribusi', form.value.biayaDistribusi)
  formData.append('lain_barang_rusak', form.value.biayaBarangRusak)
  formData.append('lain_harga_nasional', form.value.satuHargaNasional)
  formData.append('biaya_promosi', form.value.promotionSupport)
  formData.append('biaya_jaminan', form.value.jaminanKetersediaan)
  formData.append('biaya_sewa', form.value.biayaSewaLightBox)
  formData.append('biaya_barang_baru', form.value.biayaPromosiBarangBaru)
  formData.append('lain_harga_khusus', form.value.potonganHargaKhusus)
  formData.append('lain_service_level', form.value.serviceLevel)
  formData.append('lain_denda_pengiriman', form.value.dendaPengirimanToko)
  formData.append('dukungan_sampling', form.value.biayaSampling)
  formData.append('dukungan_hadiah', form.value.biayaHadiah)
  formData.append('dukungan_partisipasi_pembukaan', form.value.biayaPartisipasi)
  formData.append('dukungan_harga_pembukaan', form.value.potonganHargaPembukaan)
  formData.append('dukungan_partisipasi_ulangtahun', form.value.biayaPartisipasiUlangTahun)
  formData.append('dukungan_denda_barang', form.value.dendaBarangTidakDikirim)
  formData.append('location_head', form.value.locationHead)
  formData.append('location_department', form.value.locationDepartment)
  formData.append('location_code', form.value.location)
  formData.append('is_office', form.value.is_office)
  formData.append('is_not_dp', form.value.excludeDP)
  formData.append('is_active', form.value.is_active)
  formData.append('max_invoice', form.value.maxInvoice)
  formData.append('info', form.value.info)
  formData.append('business_type_id', selectedBusinessType.value ? selectedBusinessType.value.value : null);
  formData.append('cust_group', selectedGroup.value ? selectedGroup.value.value : null);
  formData.append('currency', selectedCurrency.value ? selectedCurrency.value.value : null);
  formData.append('outlet', selectedNewOutlet.value ? selectedNewOutlet.value.value : null);

  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await axios.post(`/api/master/customer/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Customer berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log(formData)
    } else {
      // Create new company
      response = await axios.post('/api/master/customer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Customer berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log('create')
    }
    router.push('/master/customer') // Redirect to company list page
  } catch (error) {
    console.error('Error saving company:', error)
  }
}

// Handle file upload
const handleFileUpload = (event) => {
  form.value.logo = event.target.files[0]
}

// Check if we're in "edit" mode or "create" mode
onMounted(() => {
  fetchBusinessType();
  fetchCurrency();
  fetchGroup();
  selectedNewOutlet.value = newOutletOptions.find(option => option.value === 1);
  if (route.params.id) {
    isEdit.value = true
    fetchCustomerData(route.params.id)
    console.log(route.params.id)
  }
})

// Watch for route changes (in case params change)
watch(() => route.params.id, (newId) => {
  if (newId) {
    isEdit.value = true
    fetchCustomerData(newId)
    console.log(form.value)
  } else {
    isEdit.value = false
    form.value = {
      id: null,
      code: '',
      name: '',
      address: '',
      phone: '',
      email: '',
      logo: null,
      is_active: 1
    }
  }
})

const revert = () => {
  console.log('revert clicked');
}

const back = () => {
  router.push({ name: 'Company' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
