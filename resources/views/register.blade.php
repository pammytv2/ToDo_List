<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">



    <link rel="stylesheet" href="{{ url('frontend/css/styles.css') }}" />


    <title>Animated Sign in form - Bedimcode</title>
</head>

<body>
   
    <header class="header" id="header">
        <nav class="nav container">
            <a href="#" class="nav__logo">TODO LIST</a>



        </nav>
    </header>


    <div class="login">
        <img src="{{ asset('frontend/img/b1.jpg') }}" alt="login image" class="login__img">

        <form action="" class="login__form">
            <h1 class="login__title">Register</h1>

            <div class="login__content">
                <div class="login__box">
                    <i class="ri-user-3-line login__icon"></i>

                    <div class="login__box-input">
                        <input type="text" required class="login__input" id="username" placeholder=" ">
                        <label for="username" class="login__label">UserName</label>
                    </div>
                </div>


                <div class="login__box">
                    <i class="ri-user-3-line login__icon"></i>

                    <div class="login__box-input">
                        <input type="email" required class="login__input" id="login-email" placeholder=" ">
                        <label for="login-email" class="login__label">Email</label>
                    </div>
                </div>





                <div class="login__box">
                    <i class="ri-lock-2-line login__icon"></i>

                    <div class="login__box-input">
                        <input type="password" required class="login__input" id="login-pass1" placeholder=" ">
                        <label for="login-pass1" class="login__label">Password 6 characters</label>
                        <i class="ri-eye-off-line login__eye" id="login-eye1"></i>
                    </div>
                </div>



                <div class="login__box">
                    <i class="ri-lock-2-line login__icon"></i>

                    <div class="login__box-input">
                        <input type="password" required class="login__input" id="login-pass" placeholder=" ">
                        <label for="login-pass" class="login__label">ConfirmPassword </label>
                        <i class="ri-eye-off-line login__eye" id="login-eye"></i>
                    </div>
                </div>

                <div class="login__check">
                    <div class="login__check-group">
                        <input type="checkbox" class="login__check-input" id="login-check">
                        <label for="login-check" class="login__check-label">Remember me</label>
                    </div>

                    <a href="#" class="login__forgot">Forgot Password?</a>
                </div>

                <button type="submit" class="login__button">Sign in</button>


        </form>
    </div>

   
    <script src="{{ url('frontend/js/Register.js') }}"></script>
</body>

</html>
