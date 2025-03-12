<!doctype html>
<html lang="en" data-layout="vertical" data-topbar="light" data-sidebar="dark" data-sidebar-size="lg">

    <head>

        <meta charset="utf-8" />
        <title>{{ config('app.companyInfo.name') }}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="csrf-token" content="{{csrf_token()}}">
        <!-- App favicon -->
        <link rel="shortcut icon" href="{{ asset(config('app.companyInfo.logo')) }}">

        <!-- gridjs css -->
        <link rel="stylesheet" href="{{asset('assets/libs/gridjs/theme/mermaid.min.css')}}">

        <!-- Layout config Js -->
        <script src="{{asset('assets/js/layout.js')}}"></script>
        <!-- Bootstrap Css -->
        <link href="{{asset('assets/css/bootstrap.min.css')}}" rel="stylesheet" type="text/css" />
        <!-- Icons Css -->
        <link href="{{asset('assets/css/icons.min.css')}}" rel="stylesheet" type="text/css" />
        <!-- App Css-->
        <link href="{{asset('assets/css/app.min.cs')}}s" rel="stylesheet" type="text/css" />
        <!-- custom Css-->
        <link href="{{asset('assets/css/custom.min.css')}}" rel="stylesheet" type="text/css" />
        {{-- style --}}
        <link href="{{asset('css/style.css')}}" rel="stylesheet" type="text/css" />

        {{-- Poppins --}}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">

        {{-- datatable --}}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.css">
        <link rel="stylesheet" href="https://cdn.datatables.net/1.11.3/css/dataTables.bootstrap4.min.css">

        {{-- Image Upload --}}
        <link href="{{ asset('assets/css/image-uploader.min.css') }}" rel="stylesheet">
    </head>

    <body>

           <!-- auth-page wrapper -->
           <div class="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
            <div class="bg-overlay" style="background-image: radial-gradient(circle at 99% 33%, hsla(235,0%,48%,0.03) 0%, hsla(235,0%,48%,0.03) 37%,transparent 37%, transparent 100%),radial-gradient(circle at 46% 16%, hsla(235,0%,48%,0.03) 0%, hsla(235,0%,48%,0.03) 43%,transparent 43%, transparent 100%),radial-gradient(circle at 99% 25%, hsla(235,0%,48%,0.03) 0%, hsla(235,0%,48%,0.03) 22%,transparent 22%, transparent 100%),radial-gradient(circle at 57% 88%, hsla(235,0%,48%,0.03) 0%, hsla(235,0%,48%,0.03) 86%,transparent 86%, transparent 100%),radial-gradient(circle at 82% 78%, hsla(235,0%,48%,0.03) 0%, hsla(235,0%,48%,0.03) 22%,transparent 22%, transparent 100%),linear-gradient(90deg, rgb(0,0,0),rgb(0,0,0));"></div>
            <!-- auth-page content -->
            <div class="auth-page-content overflow-hidden pt-lg-5">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card overflow-hidden" style="background: transparent;border-radius: 15px">
                                <div class="row g-0">
                                    <div class="col-lg-6">
                                        <div class="p-lg-5 p-4  h-100">
                                            <div class="position-relative h-100 d-flex flex-column justify-content-center align-items-center    ">
                                                <div class="mb-4">
                                                    <a href="#" class="d-block">
                                                        <img src="{{ asset(config('app.companyInfo.logo_transparent')) }}" class="rounded" alt="" style="height: 150px;">
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- end col -->

                                    <div class="col-lg-6">
                                        <div class="p-lg-5 p-4">
                                            <div>
                                                <h5 class="text-white">Welcome Back !</h5>
                                                <p class="text-muted">Sign in to continue to {{ config('app.companyInfo.name') }}</p>
                                            </div>

                                            <div class="mt-4">
                                                <form action="{{ route('postLogin') }}" method="POST">
                                                    @csrf
                                                    <div class="mb-3">
                                                        <label for="username" class="form-label text-white">Username</label>
                                                        <input type="text" name="email" class="form-control" id="username" placeholder="Enter username">
                                                        @error('email')
                                                            <span class="text-danger">{{ $message }}</span>
                                                        @enderror
                                                    </div>

                                                    <div class="mb-3">

                                                        <label class="form-label text-white" for="password-input">Password</label>
                                                        <div class="position-relative auth-pass-inputgroup mb-3">
                                                            <input type="password" name="password" class="form-control pe-5" placeholder="Enter password" id="password-input">
                                                            <button class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon"><i class="ri-eye-fill align-middle"></i></button>
                                                            @error('password')
                                                                <span class="text-danger">{{ $message }}</span>
                                                            @enderror
                                                            @if (session('credentialError'))
                                                                <span class="text-danger">{{session('credentialError')}}</span>
                                                            @endif
                                                        </div>
                                                    </div>


                                                    <div class="mt-4">
                                                        <button class="btn w-100 text-white" style="background: #740C08" type="submit">Sign In</button>
                                                    </div>
                                                </form>
                                            </div>


                                        </div>
                                    </div>
                                    <!-- end col -->
                                </div>
                                <!-- end row -->
                            </div>
                            <!-- end card -->
                        </div>
                        <!-- end col -->

                    </div>
                    <!-- end row -->
                </div>
                <!-- end container -->
            </div>
            <!-- end auth page content -->

            <!-- footer -->
            <footer class="footer">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="text-center">
                                <p class="mb-0">{{config('app.companyInfo.name')}} Developed by <a target="_blank" href="https://app.com.mm">App.com.mm</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <!-- end Footer -->
        </div>
        <!-- end auth-page-wrapper -->

        {{-- Jquery --}}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <!-- JAVASCRIPT -->
        <script src="{{asset('assets/libs/bootstrap/js/bootstrap.bundle.min.js')}}"></script>
        <script src="{{asset('assets/libs/simplebar/simplebar.min.js')}}"></script>
        <script src="{{asset('assets/libs/node-waves/waves.min.js')}}"></script>
        <script src="{{asset('assets/libs/feather-icons/feather.min.js')}}"></script>
        <script src="{{asset('assets/js/pages/plugins/lord-icon-2.1.0.js')}}"></script>
        <script src="{{asset('assets/js/plugins.js')}}"></script>

        <!-- gridjs js -->
        <script src="{{asset('assets/libs/gridjs/gridjs.umd.js')}}"></script>
        <!-- gridjs init -->
        <script src="{{asset('assets/js/pages/gridjs.init.js')}}"></script>

        {{-- password  --}}
        <script src="{{ asset('assets/js/pages/password-addon.init.js') }}"></script>
        <!-- App js -->
        <script src="{{asset('assets/js/app.js')}}"></script>

        {{-- Sweet Alert --}}
        <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>

        {{-- Datatable --}}
        <script src="https://cdn.datatables.net/1.11.3/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/1.11.3/js/dataTables.bootstrap4.min.js"></script>

        {{-- jsvalidation --}}
        <script type="text/javascript" src="{{ asset('vendor/jsvalidation/js/jsvalidation.js')}}"></script>
        <script>
            $(document).ready(function() {
                let token = document.head.querySelector('meta[name="csrf-token"]')

                if(token) {
                    $.ajaxSetup({
                        headers : {
                            'X-CSRF-TOKEN' : token.content
                        }
                    })
                };


            })
        </script>
    </body>

</html>
